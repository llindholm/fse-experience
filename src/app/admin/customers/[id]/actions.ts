"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";

const VALID_COURSE_SLUGS = new Set([
    "million-dollar-authority",
    "effortless-sales-system",
    "signature-close",
]);

function getRequiredString(
    formData: FormData,
    fieldName: string
) {
    const value = formData.get(fieldName);

    if (
        typeof value !== "string" ||
        value.trim().length === 0
    ) {
        throw new Error(
            `Missing required field: ${fieldName}`
        );
    }

    return value.trim();
}

function validateCourseSlug(courseSlug: string) {
    if (!VALID_COURSE_SLUGS.has(courseSlug)) {
        throw new Error("Invalid course selection.");
    }
}

export async function grantCourseAccessAction(
    formData: FormData
) {
    const customerId = getRequiredString(
        formData,
        "customerId"
    );

    const courseSlug = getRequiredString(
        formData,
        "courseSlug"
    );

    validateCourseSlug(courseSlug);

    const supabase = createAdminClient();

    const { error } = await supabase
        .from("course_entitlements")
        .upsert(
            {
                user_id: customerId,
                course_slug: courseSlug,
                revoked_at: null,
            },
            {
                onConflict: "user_id,course_slug",
            }
        );

    if (error) {
        throw new Error(
            `Unable to grant course access: ${error.message}`
        );
    }

    revalidatePath("/admin/customers");
    revalidatePath(
        `/admin/customers/${customerId}`
    );
}

export async function revokeCourseAccessAction(
    formData: FormData
) {
    const customerId = getRequiredString(
        formData,
        "customerId"
    );

    const courseSlug = getRequiredString(
        formData,
        "courseSlug"
    );

    validateCourseSlug(courseSlug);

    const supabase = createAdminClient();

    const { error } = await supabase
        .from("course_entitlements")
        .update({
            revoked_at: new Date().toISOString(),
        })
        .eq("user_id", customerId)
        .eq("course_slug", courseSlug)
        .is("revoked_at", null);

    if (error) {
        throw new Error(
            `Unable to revoke course access: ${error.message}`
        );
    }

    revalidatePath("/admin/customers");
    revalidatePath(
        `/admin/customers/${customerId}`
    );
}