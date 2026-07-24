import "server-only";

import { grantCourseAccess } from "@/lib/admin/customer-access";
import {
    buildWelcomeUrl,
    createWelcomeToken,
} from "@/lib/auth/welcome-token";
import { createAdminClient } from "@/lib/supabase/admin";

export type CreateCustomerInput = {
    email: string;
    firstName?: string;
    lastName?: string;
    courseSlugs?: string[];

    /**
     * Sends Supabase's standard invitation email.
     *
     * Keep this false for the new branded onboarding flow.
     */
    sendInvitation?: boolean;

    /**
     * Generates a new branded, one-time /welcome link.
     *
     * Any previous active welcome token for this member will be
     * marked as superseded.
     */
    generateWelcomeLink?: boolean;
};

export type CreateCustomerResult = {
    userId: string;
    email: string;
    created: boolean;
    invited: boolean;
    welcomeUrl: string | null;
    welcomeExpiresAt: string | null;
};

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

async function findAuthUserByEmail(email: string) {
    const supabase = createAdminClient();

    let page = 1;
    const perPage = 1000;

    while (true) {
        const { data, error } =
            await supabase.auth.admin.listUsers({
                page,
                perPage,
            });

        if (error) {
            throw new Error(
                `Unable to search customer accounts: ${error.message}`
            );
        }

        const match = data.users.find(
            (user) =>
                user.email?.toLowerCase() === email
        );

        if (match) {
            return match;
        }

        if (data.users.length < perPage) {
            return null;
        }

        page += 1;
    }
}

export async function createOrInviteCustomer({
    email,
    firstName,
    lastName,
    courseSlugs = [],
    sendInvitation = false,
    generateWelcomeLink = false,
}: CreateCustomerInput): Promise<CreateCustomerResult> {
    const supabase = createAdminClient();
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
        throw new Error("An email address is required.");
    }

    const existingUser =
        await findAuthUserByEmail(normalizedEmail);

    let userId: string;
    let created = false;
    let invited = false;

    if (existingUser) {
        userId = existingUser.id;
    } else if (sendInvitation) {
        const { data, error } =
            await supabase.auth.admin.inviteUserByEmail(
                normalizedEmail,
                {
                    data: {
                        first_name:
                            firstName?.trim() || null,
                        last_name:
                            lastName?.trim() || null,
                    },
                }
            );

        if (error) {
            throw new Error(
                `Unable to invite customer: ${error.message}`
            );
        }

        if (!data.user) {
            throw new Error(
                "Supabase did not return the invited customer."
            );
        }

        userId = data.user.id;
        created = true;
        invited = true;
    } else {
        const { data, error } =
            await supabase.auth.admin.createUser({
                email: normalizedEmail,
                email_confirm: true,
                user_metadata: {
                    first_name:
                        firstName?.trim() || null,
                    last_name:
                        lastName?.trim() || null,
                },
            });

        if (error) {
            throw new Error(
                `Unable to create customer: ${error.message}`
            );
        }

        if (!data.user) {
            throw new Error(
                "Supabase did not return the created customer."
            );
        }

        userId = data.user.id;
        created = true;
    }

    const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
            {
                id: userId,
                email: normalizedEmail,
                first_name: firstName?.trim() || null,
                last_name: lastName?.trim() || null,
                role: "member",
            },
            {
                onConflict: "id",
            }
        );

    if (profileError) {
        throw new Error(
            `Unable to save customer profile: ${profileError.message}`
        );
    }

    const uniqueCourseSlugs = [
        ...new Set(
            courseSlugs
                .map((courseSlug) => courseSlug.trim())
                .filter(Boolean)
        ),
    ];

    for (const courseSlug of uniqueCourseSlugs) {
        await grantCourseAccess(userId, courseSlug);
    }

    let welcomeUrl: string | null = null;
    let welcomeExpiresAt: string | null = null;

    if (generateWelcomeLink) {
        const welcomeToken =
            await createWelcomeToken(userId);

        welcomeUrl =
            buildWelcomeUrl(welcomeToken.token);

        welcomeExpiresAt =
            welcomeToken.expiresAt;
    }

    return {
        userId,
        email: normalizedEmail,
        created,
        invited,
        welcomeUrl,
        welcomeExpiresAt,
    };
}