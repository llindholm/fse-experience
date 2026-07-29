import Link from "next/link";

import { getCustomers } from "@/lib/admin/customers";
import { createCustomerAction } from "./actions";

import "./customers.css";

type CustomerStatus = {
    label: string;
    className: string;
};

function formatDate(value: string | null) {
    if (!value) {
        return "Never";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function getCustomerName(customer: {
    firstName: string | null;
    lastName: string | null;
    email: string;
}) {
    const fullName = [
        customer.firstName,
        customer.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    return fullName || customer.email;
}

function getCustomerStatus(customer: {
    emailConfirmedAt: string | null;
    lastSignInAt: string | null;
}): CustomerStatus {
    if (!customer.emailConfirmedAt) {
        return {
            label: "Pending setup",
            className: "is-pending",
        };
    }

    if (!customer.lastSignInAt) {
        return {
            label: "Never logged in",
            className: "is-new",
        };
    }

    return {
        label: "Active",
        className: "is-active",
    };
}

function getCourseLabel(courseSlug: string) {
    const courseNames: Record<string, string> = {
        "million-dollar-authority":
            "Million Dollar Authority",
        "effortless-sales-system":
            "Effortless Sales System",
        "signature-close":
            "The Signature Close",
    };

    return courseNames[courseSlug] ?? courseSlug;
}

function getAccessSummary(courseSlugs: string[]) {
    if (courseSlugs.length === 0) {
        return "No access";
    }

    const hasFullFseBundle = [
        "million-dollar-authority",
        "effortless-sales-system",
        "signature-close",
    ].every((courseSlug) =>
        courseSlugs.includes(courseSlug)
    );

    if (hasFullFseBundle) {
        return "Feminine Sales Engine";
    }

    if (courseSlugs.length === 1) {
        return getCourseLabel(courseSlugs[0]);
    }

    return `${getCourseLabel(
        courseSlugs[0]
    )} + ${courseSlugs.length - 1} more`;
}

export default async function CustomersPage() {
    const customers = await getCustomers();

    const memberCount = customers.filter(
        (customer) => customer.role === "member"
    ).length;

    const adminCount = customers.filter(
        (customer) => customer.role === "admin"
    ).length;

    const activeMemberCount = customers.filter(
        (customer) =>
            customer.role === "member" &&
            Boolean(customer.lastSignInAt)
    ).length;

    const pendingSetupCount = customers.filter(
        (customer) =>
            customer.role === "member" &&
            !customer.lastSignInAt
    ).length;

    return (
        <main className="customers-page">
            <header className="customers-header">
                <div className="customers-header__copy">
                    <p className="customers-eyebrow">
                        Members
                    </p>

                    <h1>Customers</h1>

                    <p className="customers-intro">
                        Manage member accounts, onboarding,
                        and access to the To Living Free
                        Library.
                    </p>
                </div>

                <details className="customers-create-panel">
                    <summary className="customers-create">
                        <span aria-hidden="true">+</span>
                        Add member
                    </summary>

                    <form
                        action={createCustomerAction}
                        className="customers-create-form"
                    >
                        <div className="customers-create-form__heading">
                            <div>
                                <p className="customers-eyebrow">
                                    New member
                                </p>

                                <h2>Add a member</h2>
                            </div>

                            <p>
                                Create their account and assign
                                their initial Library access.
                            </p>
                        </div>

                        <div className="customers-create-form__fields">
                            <label>
                                <span>First name</span>

                                <input
                                    type="text"
                                    name="firstName"
                                    autoComplete="given-name"
                                />
                            </label>

                            <label>
                                <span>Last name</span>

                                <input
                                    type="text"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </label>

                            <label className="customers-create-form__email">
                                <span>Email address</span>

                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                />
                            </label>
                        </div>

                        <fieldset className="customers-create-access">
                            <legend>
                                Initial Library access
                            </legend>

                            <label>
                                <input
                                    type="checkbox"
                                    name="courseSlugs"
                                    value="million-dollar-authority"
                                />

                                <span>
                                    Million Dollar Authority
                                </span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="courseSlugs"
                                    value="effortless-sales-system"
                                />

                                <span>
                                    Effortless Sales System
                                </span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="courseSlugs"
                                    value="signature-close"
                                />

                                <span>
                                    The Signature Close
                                </span>
                            </label>
                        </fieldset>

                        <div className="customers-create-form__footer">
                            <p>
                                Existing members will keep their
                                account. Any selected access will
                                simply be added.
                            </p>

                            <button type="submit">
                                Add member
                            </button>
                        </div>
                    </form>
                </details>
            </header>

            <section
                className="customers-summary"
                aria-label="Customer summary"
            >
                <div className="customers-summary__card">
                    <span>Members</span>
                    <strong>{memberCount}</strong>
                    <small>
                        Library customer accounts
                    </small>
                </div>

                <div className="customers-summary__card">
                    <span>Active members</span>
                    <strong>{activeMemberCount}</strong>
                    <small>
                        Have logged into the Library
                    </small>
                </div>

                <div className="customers-summary__card">
                    <span>Awaiting setup</span>
                    <strong>{pendingSetupCount}</strong>
                    <small>
                        Have not logged in yet
                    </small>
                </div>

                <div className="customers-summary__card">
                    <span>Administrators</span>
                    <strong>{adminCount}</strong>
                    <small>
                        Internal platform access
                    </small>
                </div>
            </section>

            <section className="customers-list">
                <div className="customers-list__top">
                    <div>
                        <p className="customers-eyebrow">
                            Directory
                        </p>

                        <h2>All customers</h2>
                    </div>

                    <span className="customers-list__count">
                        {customers.length}{" "}
                        {customers.length === 1
                            ? "account"
                            : "accounts"}
                    </span>
                </div>

                <div className="customers-list__heading">
                    <span>Customer</span>
                    <span>Status</span>
                    <span>Library access</span>
                    <span>Last login</span>
                    <span></span>
                </div>

                {customers.length === 0 ? (
                    <div className="customers-empty">
                        <h3>No customers yet</h3>

                        <p>
                            Add your first member to begin
                            managing their Library access.
                        </p>
                    </div>
                ) : (
                    customers.map((customer) => {
                        const status =
                            getCustomerStatus(customer);

                        return (
                            <article
                                key={customer.id}
                                className="customer-row"
                            >
                                <div className="customer-row__identity">
                                    <strong>
                                        {getCustomerName(
                                            customer
                                        )}
                                    </strong>

                                    <span>
                                        {customer.email}
                                    </span>

                                    {customer.role ===
                                        "admin" && (
                                        <small>
                                            Administrator
                                        </small>
                                    )}
                                </div>

                                <div className="customer-row__status">
                                    <span
                                        className={`customer-status ${status.className}`}
                                    >
                                        <span
                                            className="customer-status__dot"
                                            aria-hidden="true"
                                        />

                                        {status.label}
                                    </span>
                                </div>

                                <div className="customer-row__access">
                                    <strong>
                                        {getAccessSummary(
                                            customer.courseSlugs
                                        )}
                                    </strong>

                                    <span>
                                        {customer.courseSlugs
                                            .length === 0
                                            ? "No courses assigned"
                                            : `${
                                                  customer
                                                      .courseSlugs
                                                      .length
                                              } ${
                                                  customer
                                                      .courseSlugs
                                                      .length === 1
                                                      ? "course"
                                                      : "courses"
                                              }`}
                                    </span>
                                </div>

                                <div className="customer-row__login">
                                    <strong>
                                        {formatDate(
                                            customer.lastSignInAt
                                        )}
                                    </strong>

                                    <span>
                                        Joined{" "}
                                        {formatDate(
                                            customer.createdAt
                                        )}
                                    </span>
                                </div>

                                <Link
                                    href={`/admin/customers/${customer.id}`}
                                    className="customer-row__manage"
                                >
                                    Open
                                    <span aria-hidden="true">
                                        →
                                    </span>
                                </Link>
                            </article>
                        );
                    })
                )}
            </section>
        </main>
    );
}