const navigationItems = [
    {
        label: "Overview",
        href: "/admin",
        active: true,
    },
    {
        label: "Journey",
        href: "/admin/journey",
        active: false,
    },
    {
        label: "Visitors",
        href: "/admin/visitors",
        active: false,
    },
    {
        label: "Funnels",
        href: "/admin/funnels",
        active: false,
    },
    {
        label: "Briefs",
        href: "/admin/briefs",
        active: false,
    },
];

export default function Sidebar() {
    return (
        <aside className="dashboard-sidebar">
            <div className="dashboard-brand">
                <span className="dashboard-brand-mark">TLF</span>

                <div>
                    <p className="dashboard-brand-name">Intelligence</p>
                    <p className="dashboard-brand-subtitle">To Living Free</p>
                </div>
            </div>

            <nav className="dashboard-navigation" aria-label="Dashboard">
                <p className="dashboard-navigation-label">Workspace</p>

                <div className="dashboard-navigation-list">
                    {navigationItems.map((item) => (
                        <a
                            key={item.label}
                            className={`dashboard-navigation-link ${item.active ? "is-active" : ""
                                }`}
                            href={item.href}
                        >
                            <span>{item.label}</span>

                            {item.active && (
                                <span
                                    className="dashboard-navigation-indicator"
                                    aria-hidden="true"
                                />
                            )}
                        </a>
                    ))}
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