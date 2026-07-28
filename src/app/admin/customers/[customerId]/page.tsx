import Link from "next/link";
import { notFound } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import {
    grantCourseAccessAction,
    revokeCourseAccessAction,
    toggleRoleAction,
} from "../actions";
import "./customer-detail.css";


type CustomerDetailPageProps = {
    params: Promise<{
        customerId: string;
    }>;
};

type ProfileRow = {
    id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    role: "member" | "admin";
};

type EntitlementRow = {
    course_slug: string;
    revoked_at: string | null;
};

const courses = [
    {
        slug: "million-dollar-authority",
        title: "Million Dollar Authority",
    },
    {
        slug: "effortless-sales-system",
        title: "Effortless Sales System",
    },
    {
        slug: "signature-close",
        title: "The Signature Close",
    },
];

function formatDate(value: string | null | undefined) {
    if (!value) {
        return "Never";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export default async function CustomerDetailPage({
    params,
}: CustomerDetailPageProps) {
    const { customerId } = await params;
    const supabase = createAdminClient();

    const { data: authUserData, error: authUserError } =
        await supabase.auth.admin.getUserById(customerId);

    if (authUserError || !authUserData.user) {
        notFound();
    }

    const { data: profile, error: profileError } =
        await supabase
            .from("profiles")
            .select(
                "id, email, first_name, last_name, role"
            )
            .eq("id", customerId)
            .maybeSingle<ProfileRow>();

    if (profileError) {
        throw new Error(
            `Unable to load customer profile: ${profileError.message}`
        );
    }

    const { data: entitlements, error: entitlementsError } =
        await supabase
            .from("course_entitlements")
            .select("course_slug, revoked_at")
            .eq("user_id", customerId);

    if (entitlementsError) {
        throw new Error(
            `Unable to load course access: ${entitlementsError.message}`
        );
    }

    const authUser = authUserData.user;

    const fullName = [
        profile?.first_name,
        profile?.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    const displayName =
        fullName ||
        authUser.email ||
        profile?.email ||
        "Customer";

    const activeCourseSlugs = new Set(
        ((entitlements ?? []) as EntitlementRow[])
            .filter(
                (entitlement) =>
                    entitlement.revoked_at === null
            )
            .map(
                (entitlement) =>
                    entitlement.course_slug
            )
    );

    return (
        <main className="customer-detail-page">
            <Link
                href="/admin/customers"
                className="customer-detail-back"
            >
                ← Customers
            </Link>

            <header className="customer-detail-header">
                <div>
                    <p className="customer-detail-eyebrow">
                        Customer
                    </p>

                    <h1>{displayName}</h1>

                    <p className="customer-detail-email">
                        {authUser.email ??
                            profile?.email ??
                            "No email address"}
                    </p>
                </div>

                <div className="customer-detail-meta">
                    <div>
                        <span>Member since</span>
                        <strong>
                            {formatDate(
                                authUser.created_at
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Last sign in</span>
                        <strong>
                            {formatDate(
                                authUser.last_sign_in_at
                            )}
                        </strong>
                    </div>
                </div>
            </header>

            <section className="customer-detail-section">
                <div className="customer-detail-section__heading">
                    <div>
                        <p className="customer-detail-eyebrow">
                            Library
                        </p>

                        <h2>Course access</h2>
                    </div>

                    <p>
                        Grant or revoke access to individual
                        courses.
                    </p>
                </div>

                <div className="customer-course-list">
                    {courses.map((course) => {
                        const hasAccess =
                            activeCourseSlugs.has(
                                course.slug
                            );

                        return (
                            <div
                                key={course.slug}
                                className="customer-course-row"
                            >
                                <div className="customer-course-row__identity">
                                    <span
                                        className={`customer-course-status ${hasAccess
                                            ? "is-active"
                                            : ""
                                            }`}
                                        aria-hidden="true"
                                    />

                                    <div>
                                        <strong>
                                            {course.title}
                                        </strong>

                                        <span>
                                            {hasAccess
                                                ? "Active access"
                                                : "No access"}
                                        </span>
                                    </div>
                                </div>

                                <form
                                    action={
                                        hasAccess
                                            ? revokeCourseAccessAction
                                            : grantCourseAccessAction
                                    }
                                >
                                    <input
                                        type="hidden"
                                        name="userId"
                                        value={customerId}
                                    />

                                    <input
                                        type="hidden"
                                        name="courseSlug"
                                        value={course.slug}
                                    />

                                    <button
                                        type="submit"
                                        className="customer-course-action"
                                    >
                                        {hasAccess ? "Revoke" : "Grant"}
                                    </button>
                                </form>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="customer-detail-section">
                <div className="customer-detail-section__heading">
                    <div>
                        <p className="customer-detail-eyebrow">
                            Permissions
                        </p>

                        <h2>Account role</h2>
                    </div>

                    <p>
                        Administrators can access the full
                        library and management area.
                    </p>
                </div>

                <div className="customer-role-panel">
                    <div>
                        <span>Current role</span>
                        <strong>
                            {profile?.role ?? "member"}
                        </strong>
                    </div>

                    <form action={toggleRoleAction}>
                        <input
                            type="hidden"
                            name="userId"
                            value={customerId}
                        />

                        <input
                            type="hidden"
                            name="currentRole"
                            value={profile?.role ?? "member"}
                        />

                        <button
                            type="submit"
                            className="customer-role-action"
                        >
                            {profile?.role === "admin"
                                ? "Change to member"
                                : "Make administrator"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}