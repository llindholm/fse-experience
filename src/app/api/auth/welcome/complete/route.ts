import "server-only";

import { NextResponse } from "next/server";

import {
    consumeWelcomeToken,
    validateWelcomeToken,
} from "@/lib/auth/welcome-token";
import { createAdminClient } from "@/lib/supabase/admin";

type CompleteWelcomePayload = {
    token?: unknown;
    password?: unknown;
};

function readString(
    value: unknown
): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();

    return trimmed || undefined;
}

function validatePassword(
    password: string
): string | null {
    if (password.length < 8) {
        return "Your password must be at least 8 characters.";
    }

    if (password.length > 128) {
        return "Your password must be fewer than 129 characters.";
    }

    return null;
}

export async function POST(request: Request) {
    try {
        let payload: CompleteWelcomePayload;

        try {
            payload =
                (await request.json()) as
                CompleteWelcomePayload;
        } catch {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "The request could not be processed.",
                },
                {
                    status: 400,
                }
            );
        }

        const token = readString(payload.token);
        const password = readPassword(
            payload.password
        );
        function readPassword(
            value: unknown
        ): string | undefined {
            if (typeof value !== "string") {
                return undefined;
            }

            return value || undefined;
        }

        if (!token) {
            return NextResponse.json(
                {
                    ok: false,
                    code: "invalid_link",
                    error:
                        "This welcome link is not valid.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!password) {
            return NextResponse.json(
                {
                    ok: false,
                    code: "password_required",
                    error:
                        "Please choose a password.",
                },
                {
                    status: 400,
                }
            );
        }

        const passwordError =
            validatePassword(password);

        if (passwordError) {
            return NextResponse.json(
                {
                    ok: false,
                    code: "invalid_password",
                    error: passwordError,
                },
                {
                    status: 400,
                }
            );
        }

        const validation =
            await validateWelcomeToken(token);

        if (!validation.valid) {
            const responseByReason = {
                not_found: {
                    code: "invalid_link",
                    error:
                        "This welcome link is not valid.",
                },
                expired: {
                    code: "expired",
                    error:
                        "This welcome invitation has expired.",
                },
                used: {
                    code: "already_used",
                    error:
                        "Your account has already been set up.",
                },
                superseded: {
                    code: "superseded",
                    error:
                        "A newer welcome invitation has been sent to you.",
                },
            } as const;

            return NextResponse.json(
                {
                    ok: false,
                    ...responseByReason[
                    validation.reason
                    ],
                },
                {
                    status: 400,
                }
            );
        }

        /*
 * Prevent welcome invitations from resetting
 * passwords on already activated accounts.
 */
        const supabase = createAdminClient();

        const { data: profile, error: profileError } =
            await supabase
                .from("profiles")
                .select("onboarding_completed_at, initial_setup_pending")
                .eq("id", validation.memberId)
                .single();

        if (profileError || !profile) {
            throw new Error(
                "Unable to verify member onboarding status."
            );
        }

        if (
            profile.onboarding_completed_at ||
            profile.initial_setup_pending !== true
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    code: "already_activated",
                    error:
                        "Your account is already set up. Please sign in instead.",
                },
                { status: 409 }
            );
        }

        /*
 * Also reject accounts with evidence of prior setup.
 * This protects against a missing activation timestamp.
 */
        const { data: authUser, error: authUserError } =
            await supabase.auth.admin.getUserById(
                validation.memberId
            );

        if (authUserError || !authUser.user) {
            throw new Error(
                "Unable to verify member authentication status."
            );
        }

        const { data: usedWelcomeToken, error: usedTokenError } =
            await supabase
                .from("member_welcome_tokens")
                .select("id")
                .eq("member_id", validation.memberId)
                .not("used_at", "is", null)
                .limit(1)
                .maybeSingle();

        if (usedTokenError) {
            throw usedTokenError;
        }

        if (authUser.user.last_sign_in_at || usedWelcomeToken) {
            return NextResponse.json(
                {
                    ok: false,
                    code: "already_activated",
                    error:
                        "Your account is already set up. Please sign in instead.",
                },
                { status: 409 }
            );
        }

        /*
         * Claim the token before changing the password.
         *
         * This conditional operation prevents two simultaneous
         * submissions from both completing successfully.
         */
        const consumed =
            await consumeWelcomeToken(token);

        if (!consumed) {
            return NextResponse.json(
                {
                    ok: false,
                    code: "already_used",
                    error:
                        "This welcome invitation has already been used.",
                },
                {
                    status: 409,
                }
            );
        }


        const {
            data: userData,
            error: userLookupError,
        } =
            await supabase.auth.admin.getUserById(
                validation.memberId
            );

        if (
            userLookupError ||
            !userData.user ||
            !userData.user.email
        ) {
            /*
             * Restore the token because onboarding could not
             * be completed after it was claimed.
             */
            const { error: restoreError } =
                await supabase
                    .from(
                        "member_welcome_tokens"
                    )
                    .update({
                        used_at: null,
                    })
                    .eq(
                        "id",
                        validation.tokenId
                    )
                    .is(
                        "superseded_at",
                        null
                    );

            if (restoreError) {
                console.error(
                    "Unable to restore welcome token",
                    restoreError
                );
            }

            throw new Error(
                userLookupError?.message ??
                "The member account could not be found."
            );
        }

        /*
 * Atomically close initial-setup eligibility
 * before creating the password.
 */
        const { data: setupClaimed, error: setupClaimError } =
            await supabase.rpc("claim_initial_setup", {
                p_member_id: validation.memberId,
            });

        if (setupClaimError) {
            throw new Error(
                `Unable to claim initial setup: ${setupClaimError.message}`
            );
        }

        if (!setupClaimed) {
            return NextResponse.json(
                {
                    ok: false,
                    code: "already_activated",
                    error:
                        "This account is no longer eligible for initial setup. Please contact support if you haven't created your password.",
                },
                { status: 409 }
            );
        }

        const { error: passwordUpdateError } =
            await supabase.auth.admin.updateUserById(
                validation.memberId,
                {
                    password,
                    email_confirm: true,
                }
            );

        if (passwordUpdateError) {
            console.error(
                "CRITICAL: Initial setup claimed but password creation failed",
                {
                    memberId: validation.memberId,
                    tokenId: validation.tokenId,
                    error: passwordUpdateError,
                }
            );

            return NextResponse.json(
                {
                    ok: false,
                    code: "setup_recovery_required",
                    error:
                        "We couldn't finish setting up your account. Please contact support so we can safely restore your invitation.",
                },
                { status: 500 }
            );
        }

        /*
         * Record successful account activation.
         */
        const { data: activatedProfile, error: activationError } =
            await supabase
                .from("profiles")
                .update({
                    onboarding_completed_at:
                        new Date().toISOString(),
                })
                .eq("id", validation.memberId)
                .is("onboarding_completed_at", null)
                .select("id")
                .maybeSingle();

        if (activationError || !activatedProfile) {
            console.error(
                "CRITICAL: Password created but onboarding status not recorded",
                {
                    memberId: validation.memberId,
                    tokenId: validation.tokenId,
                    error: activationError,
                    noRowsUpdated: !activatedProfile,
                }
            );
        }

        return NextResponse.json(
            {
                ok: true,
                email: userData.user.email,
                memberId:
                    validation.memberId,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "no-store, max-age=0",
                },
            }
        );
    } catch (error) {
        console.error(
            "Unable to complete member welcome",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                code: "server_error",
                error:
                    "We couldn’t finish setting up your library. Please try again.",
            },
            {
                status: 500,
            }
        );
    }
}