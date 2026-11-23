"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
    demoteToMember,
    grantCourseAccess,
    promoteToAdmin,
    revokeCourseAccess,
} from "@/lib/admin/customer-access";
import { createOrInviteCustomer } from "@/lib/admin/customer-management";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function requireFormValue(
    formData: FormData,
    key: string
): string {
    const value = formData.get(key);

    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`Missing required field: ${key}`);
    }

    return value.trim();
}

export async function grantCourseAccessAction(
    formData: FormData
) {
    await requireAdmin();

    const userId = requireFormValue(formData, "userId");
    const courseSlug = requireFormValue(
        formData,
        "courseSlug"
    );

    await grantCourseAccess(userId, courseSlug);

    revalidatePath("/admin/customers");
    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath("/library", "layout");
}

export async function revokeCourseAccessAction(
    formData: FormData
) {
    await requireAdmin();

    const userId = requireFormValue(formData, "userId");
    const courseSlug = requireFormValue(
        formData,
        "courseSlug"
    );

    await revokeCourseAccess(userId, courseSlug);

    revalidatePath("/admin/customers");
    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath("/library", "layout");
}

export async function toggleRoleAction(
    formData: FormData
) {
    await requireAdmin();

    const userId = requireFormValue(formData, "userId");
    const currentRole = requireFormValue(
        formData,
        "currentRole"
    );

    if (currentRole === "admin") {
        await demoteToMember(userId);
    } else if (currentRole === "member") {
        await promoteToAdmin(userId);
    } else {
        throw new Error("Invalid customer role.");
    }

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/customers");
    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath("/library", "layout");
}

export async function createCustomerAction(
    formData: FormData
) {
    await requireAdmin();

    const email = requireFormValue(formData, "email");

    const firstName =
        formData.get("firstName")?.toString().trim() ||
        undefined;

    const lastName =
        formData.get("lastName")?.toString().trim() ||
        undefined;

    const courseSlugs = formData
        .getAll("courseSlugs")
        .filter(
            (value): value is string =>
                typeof value === "string"
        );

    const result = await createOrInviteCustomer({
        email,
        firstName,
        lastName,
        courseSlugs,
    });

    revalidatePath("/admin/customers");
    revalidatePath(
        `/admin/customers/${result.userId}`
    );
    revalidatePath("/library", "layout");

    redirect(`/admin/customers/${result.userId}`);
}