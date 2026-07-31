"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavigationItem = {
    href: string;
    label: string;
    description: string;
    icon: React.ReactNode;
};

const navigationItems: AdminNavigationItem[] = [
    {
        href: "/admin",
        label: "Dashboard",
        description: "FSE performance",
        icon: (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z" />
            </svg>
        ),
    },
    {
    href: "/admin/acquisition",
    label: "Acquisition Lab",
    description: "Organic demand",
    icon: (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M12 2a7 7 0 0 0-4 12.74V18a2 2 0 0 0 2 2h1v2h2v-2h1a2 2 0 0 0 2-2v-3.26A7 7 0 0 0 12 2Zm2.75 11.34-.75.47V18h-4v-4.19l-.75-.47A5 5 0 1 1 14.75 13.34ZM9 9h6v2H9V9Z" />
        </svg>
    ),
},
    {
        href: "/admin/customers",
        label: "Customers",
        description: "Members and access",
        icon: (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM8 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 0c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4ZM8 15c-3.11 0-8 1.56-8 4v1h6v-3c0-.73.25-1.39.68-1.98A9.38 9.38 0 0 0 8 15Z" />
            </svg>
        ),
    },
];

function isNavigationItemActive(
    pathname: string,
    href: string
) {
    if (href === "/admin") {
        return pathname === "/admin";
    }

    return (
        pathname === href ||
        pathname.startsWith(`${href}/`)
    );
}

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__brand">
                <Link
                    href="/admin"
                    className="admin-sidebar__brand-link"
                >
                    <span className="admin-sidebar__brand-mark">
                        TLF
                    </span>

                    <span className="admin-sidebar__brand-copy">
                        <strong>To Living Free</strong>
                        <small>Admin</small>
                    </span>
                </Link>
            </div>

            <nav
                className="admin-sidebar__nav"
                aria-label="Admin navigation"
            >
                <p className="admin-sidebar__label">
                    Workspace
                </p>

                {navigationItems.map((item) => {
                    const isActive =
                        isNavigationItemActive(
                            pathname,
                            item.href
                        );

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-sidebar__link ${
                                isActive
                                    ? "is-active"
                                    : ""
                            }`}
                            aria-current={
                                isActive
                                    ? "page"
                                    : undefined
                            }
                        >
                            <span className="admin-sidebar__icon">
                                {item.icon}
                            </span>

                            <span className="admin-sidebar__link-copy">
                                <strong>
                                    {item.label}
                                </strong>

                                <small>
                                    {
                                        item.description
                                    }
                                </small>
                            </span>

                            <span
                                className="admin-sidebar__arrow"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="admin-sidebar__footer">
                <p>
                    Internal operating system
                </p>

                <span>
                    To Living Free
                </span>
            </div>
        </aside>
    );
}