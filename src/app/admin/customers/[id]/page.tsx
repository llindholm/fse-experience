import Link from "next/link";
import { notFound } from "next/navigation";

import {
    getCustomerById,
    type AdminCustomer,
} from "@/lib/admin/customers";

import {
    grantCourseAccessAction,
    revokeCourseAccessAction,
} from "./actions";

import "./customer-detail.css";

type CustomerDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

type CourseOption = {
    slug: string;
    title: string;
    description: string;
};

const COURSE_OPTIONS: CourseOption[] = [
    {
        slug: "million-dollar-authority",
        title: "Million Dollar Authority",
        description:
            "Premium messaging, positioning, and authority.",
    },
    {
        slug: "effortless-sales-system",
        title: "Effortless Sales System",
        description:
            "The organic content system that creates demand.",
    },
    {
        slug: "signature-close",
        title: "The Signature Close",
        description:
            "The complete quiet-conversion funnel system.",
    },
];

function formatDate(value: string | null) {
    if (!value) {
        return "Never";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function getCustomerName(
    customer: AdminCustomer
) {
    const fullName = [
        customer.firstName,
        customer.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    return fullName || customer.email;
}

function getSetupStatus(
    customer: AdminCustomer
) {
    if (!customer.emailConfirmedAt) {
        return {
            label: "Pending setup",
            className: "is-pending",
            description:
                "The member has not completed account setup.",
        };
    }

    if (!customer.lastSignInAt) {
        return {
            label: "Never logged in",
            className: "is-new",
            description:
                "The account exists but has not entered the Library.",
        };
    }

    return {
        label: "Active",
        className: "is-active",
        description:
            "The member has completed setup and logged in.",
    };
}

export default async function CustomerDetailPage({
    params,
}: CustomerDetailPageProps) {
    const { id } = await params;

    const customer = await getCustomerById(id);

    if (!customer) {
        notFound();
    }

    const status = getSetupStatus(customer);

    return (
        <main className="customer-detail-page">
            <header className="customer-detail-header">
                <Link
                    href="/admin/customers"
                    className="customer-detail-back"
                >
                    <span aria-hidden="true">←</span>
                    Customers
                </Link>

                <div className="customer-detail-header__main">
                    <div>
                        <p className="customer-detail-eyebrow">
                            Member account
                        </p>

                        <h1>
                            {getCustomerName(customer)}
                        </h1>

                        <p className="customer-detail-email">
                            {customer.email}
                        </p>
                    </div>

                    <span
                        className={`customer-detail-status ${status.className}`}
                    >
                        <span
                            className="customer-detail-status__dot"
                            aria-hidden="true"
                        />

                        {status.label}
                    </span>
                </div>
            </header>

            <section
                className="customer-detail-summary"
                aria-label="Account details"
            >
                <div className="customer-detail-summary__card">
                    <span>Account type</span>

                    <strong>
                        {customer.role === "admin"
                            ? "Administrator"
                            : "Member"}
                    </strong>

                    <small>
                        {customer.role === "admin"
                            ? "Internal platform access"
                            : "Library customer account"}
                    </small>
                </div>

                <div className="customer-detail-summary__card">
                    <span>Joined</span>

                    <strong>
                        {formatDate(customer.createdAt)}
                    </strong>

                    <small>
                        Account creation date
                    </small>
                </div>

                <div className="customer-detail-summary__card">
                    <span>Last login</span>

                    <strong>
                        {formatDate(
                            customer.lastSignInAt
                        )}
                    </strong>

                    <small>
                        Most recent Library session
                    </small>
                </div>

                <div className="customer-detail-summary__card">
                    <span>Course access</span>

                    <strong>
                        {customer.courseSlugs.length}
                    </strong>

                    <small>
                        {customer.courseSlugs.length === 1
                            ? "Active course"
                            : "Active courses"}
                    </small>
                </div>
            </section>

            <div className="customer-detail-layout">
                <section className="customer-detail-panel customer-access-panel">
                    <div className="customer-detail-panel__heading">
                        <div>
                            <p className="customer-detail-eyebrow">
                                Entitlements
                            </p>

                            <h2>Library access</h2>
                        </div>

                        <p>
                            Grant or remove access without
                            changing the member’s account.
                        </p>
                    </div>

                    <div className="customer-course-list">
                        {COURSE_OPTIONS.map((course) => {
                            const hasAccess =
                                customer.courseSlugs.includes(
                                    course.slug
                                );

                            return (
                                <article
                                    key={course.slug}
                                    className={`customer-course ${
                                        hasAccess
                                            ? "has-access"
                                            : ""
                                    }`}
                                >
                                    <div className="customer-course__copy">
                                        <div className="customer-course__title">
                                            <h3>
                                                {course.title}
                                            </h3>

                                            <span>
                                                {hasAccess
                                                    ? "Access active"
                                                    : "No access"}
                                            </span>
                                        </div>

                                        <p>
                                            {
                                                course.description
                                            }
                                        </p>
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
                                            name="customerId"
                                            value={customer.id}
                                        />

                                        <input
                                            type="hidden"
                                            name="courseSlug"
                                            value={course.slug}
                                        />

                                        <button
                                            type="submit"
                                            className={
                                                hasAccess
                                                    ? "customer-course__remove"
                                                    : "customer-course__grant"
                                            }
                                        >
                                            {hasAccess
                                                ? "Remove access"
                                                : "Grant access"}
                                        </button>
                                    </form>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <aside className="customer-detail-sidebar">
                    <section className="customer-detail-panel">
                        <div className="customer-detail-panel__heading customer-detail-panel__heading--compact">
                            <div>
                                <p className="customer-detail-eyebrow">
                                    Onboarding
                                </p>

                                <h2>Account status</h2>
                            </div>
                        </div>

                        <div className="customer-onboarding-status">
                            <span
                                className={`customer-detail-status ${status.className}`}
                            >
                                <span
                                    className="customer-detail-status__dot"
                                    aria-hidden="true"
                                />

                                {status.label}
                            </span>

                            <p>{status.description}</p>
                        </div>

                        <dl className="customer-account-facts">
                            <div>
                                <dt>Email confirmed</dt>

                                <dd>
                                    {customer.emailConfirmedAt
                                        ? formatDate(
                                              customer.emailConfirmedAt
                                          )
                                        : "Not yet"}
                                </dd>
                            </div>

                            <div>
                                <dt>Last login</dt>

                                <dd>
                                    {formatDate(
                                        customer.lastSignInAt
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="customer-detail-panel">
                        <div className="customer-detail-panel__heading customer-detail-panel__heading--compact">
                            <div>
                                <p className="customer-detail-eyebrow">
                                    Customer ID
                                </p>

                                <h2>Account reference</h2>
                            </div>
                        </div>

                        <code className="customer-detail-id">
                            {customer.id}
                        </code>

                        <p className="customer-detail-note">
                            This is the member’s Supabase
                            authentication ID and entitlement
                            reference.
                        </p>
                    </section>
                </aside>
            </div>
        </main>
    );
}