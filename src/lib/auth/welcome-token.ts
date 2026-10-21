import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";

const WELCOME_TOKEN_BYTES = 32;
const WELCOME_TOKEN_EXPIRY_HOURS = 2160;

const WELCOME_TOKEN_TABLE = "member_welcome_tokens";

export type WelcomeTokenFailureReason =
    | "not_found"
    | "expired"
    | "used"
    | "superseded";

export type WelcomeTokenValidationResult =
    | {
        valid: true;
        memberId: string;
        tokenId: string;
        expiresAt: string;
    }
    | {
        valid: false;
        reason: WelcomeTokenFailureReason;
    };

export type CreatedWelcomeToken = {
    token: string;
    expiresAt: string;
};

type WelcomeTokenRow = {
    id: string;
    member_id: string;
    token_hash: string;
    expires_at: string;
    used_at: string | null;
    superseded_at: string | null;
    created_at: string;
};

/**
 * Creates a SHA-256 hash of the raw welcome token.
 *
 * Only the hash is stored in the database. The raw token exists only in the
 * URL sent to the member.
 */
function hashWelcomeToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

/**
 * Generates a cryptographically secure, URL-safe token.
 */
function generateRawWelcomeToken(): string {
    return randomBytes(WELCOME_TOKEN_BYTES).toString("base64url");
}

/**
 * Marks all currently active welcome tokens for a member as superseded.
 *
 * This preserves old token records so the welcome page can explain that a
 * newer invitation has been issued.
 */
export async function supersedeOutstandingWelcomeTokens(
    memberId: string,
): Promise<void> {
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    const { error } = await supabase
        .from(WELCOME_TOKEN_TABLE)
        .update({
            superseded_at: now,
        })
        .eq("member_id", memberId)
        .is("used_at", null)
        .is("superseded_at", null)
        .gt("expires_at", now);

    if (error) {
        throw new Error(
            `Unable to supersede existing welcome tokens: ${error.message}`,
        );
    }
}

/**
 * Creates a new welcome token for a member.
 *
 * Any previous active token is marked as superseded before the new token is
 * inserted.
 *
 * The returned raw token must be sent to the member. It is never stored in the
 * database and cannot be recovered later.
 */
export async function createWelcomeToken(
    memberId: string,
): Promise<CreatedWelcomeToken> {
    if (!memberId) {
        throw new Error("A member ID is required to create a welcome token.");
    }

    const supabase = createAdminClient();

    const { data: profile, error: profileError } =
        await supabase
            .from("profiles")
            .select("role, initial_setup_pending, onboarding_completed_at")
            .eq("id", memberId)
            .single();

    if (profileError || !profile) {
        throw new Error(
            "Unable to verify member eligibility for a welcome invitation."
        );
    }

    if (
        profile.role !== "member" ||
        profile.initial_setup_pending !== true ||
        profile.onboarding_completed_at
    ) {
        throw new Error(
            "This member is not eligible for an initial setup invitation."
        );
    }

    const { data: usedInvitation, error: usedInvitationError } =
        await supabase
            .from(WELCOME_TOKEN_TABLE)
            .select("id")
            .eq("member_id", memberId)
            .not("used_at", "is", null)
            .limit(1)
            .maybeSingle();

    if (usedInvitationError) {
        throw new Error(
            `Unable to check previous welcome invitations: ${usedInvitationError.message}`
        );
    }

    if (usedInvitation) {
        throw new Error(
            "This member has previously used a welcome invitation."
        );
    }

    await supersedeOutstandingWelcomeTokens(memberId);

    const token = generateRawWelcomeToken();
    const tokenHash = hashWelcomeToken(token);

    const expiresAt = new Date(
        Date.now() + WELCOME_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    ).toISOString();

    const { error } = await supabase.from(WELCOME_TOKEN_TABLE).insert({
        member_id: memberId,
        token_hash: tokenHash,
        expires_at: expiresAt,
    });

    if (error) {
        throw new Error(`Unable to create welcome token: ${error.message}`);
    }

    return {
        token,
        expiresAt,
    };
}

/**
 * Validates a raw welcome token without consuming it.
 *
 * Explicit failure reasons allow /welcome to show branded, useful messaging
 * instead of exposing authentication or Supabase terminology.
 */
export async function validateWelcomeToken(
    token: string,
): Promise<WelcomeTokenValidationResult> {
    if (!token) {
        return {
            valid: false,
            reason: "not_found",
        };
    }

    const supabase = createAdminClient();
    const tokenHash = hashWelcomeToken(token);

    const { data, error } = await supabase
        .from(WELCOME_TOKEN_TABLE)
        .select(
            `
        id,
        member_id,
        token_hash,
        expires_at,
        used_at,
        superseded_at,
        created_at
      `,
        )
        .eq("token_hash", tokenHash)
        .maybeSingle<WelcomeTokenRow>();

    if (error) {
        throw new Error(`Unable to validate welcome token: ${error.message}`);
    }

    if (!data) {
        return {
            valid: false,
            reason: "not_found",
        };
    }

    if (data.superseded_at) {
        return {
            valid: false,
            reason: "superseded",
        };
    }

    if (data.used_at) {
        return {
            valid: false,
            reason: "used",
        };
    }

    if (new Date(data.expires_at).getTime() <= Date.now()) {
        return {
            valid: false,
            reason: "expired",
        };
    }

    return {
        valid: true,
        memberId: data.member_id,
        tokenId: data.id,
        expiresAt: data.expires_at,
    };
}

/**
 * Consumes an active welcome token.
 *
 * The conditional update prevents an expired, superseded, or previously used
 * token from being consumed.
 */
export async function consumeWelcomeToken(
    token: string
): Promise<boolean> {
    if (!token) {
        return false;
    }

    const supabase = createAdminClient();
    const tokenHash =
        hashWelcomeToken(token);
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from(WELCOME_TOKEN_TABLE)
        .update({
            used_at: now,
        })
        .eq("token_hash", tokenHash)
        .is("used_at", null)
        .is("superseded_at", null)
        .gt("expires_at", now)
        .select("id");

    if (error) {
        throw new Error(
            `Unable to consume welcome token: ${error.message}`
        );
    }

    return data.length === 1;
}

/**
 * Produces the complete branded welcome URL for Keap.
 */
export function buildWelcomeUrl(token: string): string {
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ??
        process.env.APP_URL ??
        "https://tolivingfree.com";

    const url = new URL("/welcome", appUrl);
    url.searchParams.set("token", token);

    return url.toString();
}