import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findAuthUserByEmail } from "@/lib/admin/customer-management";
import { findKeapContactByEmail } from "@/lib/keap/contacts";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const email =
            typeof body?.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        if (
            !email ||
            email.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Please enter a valid email address.",
                },
                { status: 400 }
            );
        }

        const genericResponse = {
            ok: true,
            message:
                "If your account is eligible, we'll email you a new invitation.",
        };

        const user = await findAuthUserByEmail(email);

        if (!user) {
            return NextResponse.json(genericResponse);
        }

        const supabase = createAdminClient();

        const { data: profile, error: profileError } =
            await supabase
                .from("profiles")
                .select("role, onboarding_completed_at, initial_setup_pending")
                .eq("id", user.id)
                .maybeSingle();

        if (profileError) {
            throw profileError;
        }

        if (
            !profile ||
            profile.role !== "member" ||
            profile.initial_setup_pending !== true ||
            profile.onboarding_completed_at ||
            user.last_sign_in_at
        ) {
            return NextResponse.json(genericResponse);
        }



        // Confirm this member has an existing invitation history.
        // A blank onboarding timestamp alone is not enough.
        const { data: invitation, error: invitationError } =
            await supabase
                .from("member_welcome_tokens")
                .select("id, used_at")
                .eq("member_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

        if (invitationError) {
            throw invitationError;
        }

        if (!invitation) {
            return NextResponse.json(genericResponse);
        }

        // Never renew an invitation if any previous
        // welcome invitation was used.
        const { data: usedInvitation, error: usedInvitationError } =
            await supabase
                .from("member_welcome_tokens")
                .select("id")
                .eq("member_id", user.id)
                .not("used_at", "is", null)
                .limit(1)
                .maybeSingle();

        if (usedInvitationError) {
            throw usedInvitationError;
        }

        if (usedInvitation) {
            return NextResponse.json(genericResponse);
        }

        // Atomically claim this member's renewal cooldown.
        const { data: renewalClaimed, error: claimError } =
            await supabase.rpc("claim_invitation_renewal", {
                p_member_id: user.id,
            });

        if (claimError) {
            throw new Error(
                `Unable to claim invitation renewal: ${claimError.message}`
            );
        }

        if (!renewalClaimed) {
            return NextResponse.json(genericResponse);
        }

        // Confirm there is a matching Keap contact
        // before generating a replacement invitation.
        const keapContactId =
            await findKeapContactByEmail(email);

        if (!keapContactId) {
            console.error(
                "Invitation renewal: no matching Keap contact",
                { memberId: user.id }
            );

            return NextResponse.json(genericResponse);
        }

        return NextResponse.json(genericResponse);


    } catch (error) {
        console.error(
            "Invitation renewal request failed:",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "Unable to process your request right now. Please try again later.",
            },
            { status: 500 }
        );
    }
}