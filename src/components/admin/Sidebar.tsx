"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
    {
        label: "Overview",
        href: "/admin",
    },
    {
        label: "Journey",
        href: "/admin/journey",
    },
    {
        label: "Visitors",
        href: "/admin/visitors",
    },
    {
        label: "Funnels",
        href: "/admin/funnels",
    },
    {
        label: "Briefs",
        href: "/admin/briefs",
    },
    {
        label: "Customers",
        href: "/admin/customers",
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    function isActive(href: string) {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    }

    return (
        <aside className="dashboard-sidebar">
            <div className="dashboard-brand">
                <span className="dashboard-brand-mark">
                    TLF
                </span>

                <div>
                    <p className="dashboard-brand-name">
                        Intelligence
                    </p>

                    <p className="dashboard-brand-subtitle">
                        To Living Free
                    </p>
                </div>
            </div>

            <nav
                className="dashboard-navigation"
                aria-label="Dashboard"
            >
                <p className="dashboard-navigation-label">
                    Workspace
                </p>

                <div className="dashboard-navigation-list">
                    {navigationItems.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.label}
                                className={`dashboard-navigation-link ${active ? "is-active" : ""
                                    }`}
                                href={item.href}
                                aria-current={
                                    active ? "page" : undefined
                                }
                            >
                                <span>{item.label}</span>

                                {active && (
                                    <span
                                        className="dashboard-navigation-indicator"
                                        aria-hidden="true"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="dashboard-sidebar-footer">
                <div className="dashboard-project">
                    <span className="dashboard-project-dot" />

                    <div>
                        <p>Feminine Sales Engine</p>
                        <span>Live experience</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}