import Link from "next/link";
import { getAdminCustomers } from "@/lib/admin/customers";
import { createCustomerAction } from "./actions";
import "./customers.css";

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

export default async function CustomersPage() {
    const customers = await getAdminCustomers();

    const adminCount = customers.filter(
        (customer) => customer.role === "admin"
    ).length;

    const activeAccessCount = customers.reduce(
        (total, customer) =>
            total + customer.courseSlugs.length,
        0
    );

    return (
        <main className="customers-page">
            <header className="customers-header">
                <div>
                    <p className="customers-eyebrow">
                        Members
                    </p>

                    <h1>Customers</h1>

                    <p className="customers-intro">
                        View member accounts and manage
                        access to the To Living Free
                        Library.
                    </p>
                </div>
            </header>
            <details className="customers-create-panel">
                <summary className="customers-create">
                    Invite customer
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

                            <h2>Invite a customer</h2>
                        </div>

                        <p>
                            Create their account, send their login
                            invitation and assign initial access.
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
                        <legend>Initial course access</legend>

                        <label>
                            <input
                                type="checkbox"
                                name="courseSlugs"
                                value="million-dollar-authority"
                            />

                            <span>Million Dollar Authority</span>
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="courseSlugs"
                                value="effortless-sales-system"
                            />

                            <span>Effortless Sales System</span>
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="courseSlugs"
                                value="signature-close"
                            />

                            <span>The Signature Close</span>
                        </label>
                    </fieldset>

                    <div className="customers-create-form__footer">
                        <p>
                            Existing customers will not receive a
                            second invitation. Their selected access
                            will simply be added.
                        </p>

                        <button type="submit">
                            Send invitation
                        </button>
                    </div>
                </form>
            </details>
            <section className="customers-summary">
                <div>
                    <span>Total customers</span>
                    <strong>{customers.length}</strong>
                </div>

                <div>
                    <span>Administrators</span>
                    <strong>{adminCount}</strong>
                </div>

                <div>
                    <span>Active course access</span>
                    <strong>{activeAccessCount}</strong>
                </div>
            </section>

            <section className="customers-list">
                <div className="customers-list__heading">
                    <span>Customer</span>
                    <span>Access</span>
                    <span>Role</span>
                    <span></span>
                </div>

                {customers.length === 0 ? (
                    <p>No customer accounts exist yet.</p>
                ) : (
                    customers.map((customer) => (
                        <div
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
                            </div>

                            <div className="customer-row__access">
                                {customer.courseSlugs.length}{" "}
                                {customer.courseSlugs.length === 1
                                    ? "course"
                                    : "courses"}
                            </div>

                            <div>
                                <span className="customer-row__role">
                                    {customer.role}
                                </span>
                            </div>

                            <Link
                                href={`/admin/customers/${customer.id}`}
                                className="customer-row__manage"
                            >
                                Manage
                                <span aria-hidden="true">
                                    →
                                </span>
                            </Link>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}