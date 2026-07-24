import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type CustomerRole = "member" | "admin";

type AccessActionResult = {
    success: true;
    userId: string;
    courseSlug?: string;
    role?: CustomerRole;
};

function getErrorMessage(error: unknown) {
    return error instanceof Error
        ? error.message
        : "An unexpected error occurred.";
}

export async function grantCourseAccess(
    userId: string,
    courseSlug: string
): Promise<AccessActionResult> {
    try {
        const supabase = createAdminClient();

        const {
            data: existingEntitlement,
            error: lookupError,
        } = await supabase
            .from("course_entitlements")
            .select("user_id, course_slug, revoked_at")
            .eq("user_id", userId)
            .eq("course_slug", courseSlug)
            .maybeSingle();

        if (lookupError) {
            throw new Error(
                `Unable to check course access: ${lookupError.message}`
            );
        }

        if (existingEntitlement) {
            const { error: restoreError } = await supabase
                .from("course_entitlements")
                .update({
                    revoked_at: null,
                })
                .eq("user_id", userId)
                .eq("course_slug", courseSlug);

            if (restoreError) {
                throw new Error(
                    `Unable to restore course access: ${restoreError.message}`
                );
            }
        } else {
            const { error: insertError } = await supabase
                .from("course_entitlements")
                .insert({
                    user_id: userId,
                    course_slug: courseSlug,
                    revoked_at: null,
                });

            if (insertError) {
                throw new Error(
                    `Unable to grant course access: ${insertError.message}`
                );
            }
        }

        return {
            success: true,
            userId,
            courseSlug,
        };
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function revokeCourseAccess(
    userId: string,
    courseSlug: string
): Promise<AccessActionResult> {
    try {
        const supabase = createAdminClient();

        const { error } = await supabase
            .from("course_entitlements")
            .update({
                revoked_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("course_slug", courseSlug)
            .is("revoked_at", null);

        if (error) {
            throw new Error(
                `Unable to revoke course access: ${error.message}`
            );
        }

        return {
            success: true,
            userId,
            courseSlug,
        };
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function setCustomerRole(
    userId: string,
    role: CustomerRole
): Promise<AccessActionResult> {
    try {
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("profiles")
            .update({
                role,
            })
            .eq("id", userId)
            .select("id")
            .maybeSingle();

        if (error) {
            throw new Error(
                `Unable to update customer role: ${error.message}`
            );
        }

        if (!data) {
            throw new Error(
                "The customer profile could not be found."
            );
        }

        return {
            success: true,
            userId,
            role,
        };
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function promoteToAdmin(
    userId: string
): Promise<AccessActionResult> {
    return setCustomerRole(userId, "admin");
}

export async function demoteToMember(
    userId: string
): Promise<AccessActionResult> {
    return setCustomerRole(userId, "member");
}