import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireCourseAccess(
    courseSlug: string,
    nextPath?: string
) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        const destination =
            nextPath ?? `/library/courses/${courseSlug}`;

        redirect(
            `/login?next=${encodeURIComponent(destination)}`
        );
    }

    const { data: profile, error: profileError } =
        await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

    if (profileError) {
        notFound();
    }

    if (profile.role === "admin") {
        return {
            userId: user.id,
            role: "admin" as const,
        };
    }

    const { data: entitlement, error: entitlementError } =
        await supabase
            .from("course_entitlements")
            .select("course_slug")
            .eq("user_id", user.id)
            .eq("course_slug", courseSlug)
            .is("revoked_at", null)
            .maybeSingle();

    if (entitlementError || !entitlement) {
        notFound();
    }

    return {
        userId: user.id,
        role: "member" as const,
    };
}