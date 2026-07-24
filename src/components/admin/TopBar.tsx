import SignOutButton from "@/components/admin/SignOutButton";

function formatDate() {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    }).format(new Date());
}

export default function TopBar() {
    return (
        <header className="dashboard-topbar">
            <div>
                <p className="dashboard-eyebrow">TLF Intelligence</p>
                <p className="dashboard-date">{formatDate()}</p>
            </div>

            <div className="dashboard-status">
                <span className="dashboard-status-dot" />
                <span>Analytics live</span>
            </div>

            <div className="dashboard-topbar-actions">
    <div className="dashboard-status">
        <span className="dashboard-status-dot" />
        Live
    </div>

    <SignOutButton />
</div>
        </header>
    );
}