import { createClient } from "@/lib/supabase/server";

export type MemberAccess = {
    userId: string;
    role: "member" | "admin";
    courseSlugs: string[];
};

export async function getMemberAccess(): Promise<MemberAccess | null> {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return null;
    }

    const [
        { data: profile, error: profileError },
        { data: entitlements, error: entitlementError },
    ] = await Promise.all([
        supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle(),

        supabase
            .from("course_entitlements")
            .select("course_slug")
            .eq("user_id", user.id)
            .is("revoked_at", null),
    ]);

    if (profileError) {
    console.error("Unable to load member profile:", {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
    });
}

if (entitlementError) {
    console.error("Unable to load course entitlements:", {
        message: entitlementError.message,
        code: entitlementError.code,
        details: entitlementError.details,
        hint: entitlementError.hint,
    });
}

    return {
        userId: user.id,
        role: profile?.role === "admin" ? "admin" : "member",
        courseSlugs:
            entitlements?.map(
                (entitlement) => entitlement.course_slug
            ) ?? [],
    };
}

export function hasCourseAccess(
    access: MemberAccess,
    courseSlug: string
) {
    return (
        access.role === "admin" ||
        access.courseSlugs.includes(courseSlug)
    );
}