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
        const password = readString(
            payload.password
        );

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

        const supabase = createAdminClient();

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

        const { error: passwordUpdateError } =
            await supabase.auth.admin.updateUserById(
                validation.memberId,
                {
                    password,
                    email_confirm: true,
                }
            );

        if (passwordUpdateError) {
            /*
             * Password creation failed, so allow the member to
             * submit this invitation again.
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
                `Unable to create member password: ${passwordUpdateError.message}`
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