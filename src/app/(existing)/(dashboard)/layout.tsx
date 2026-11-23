import type { ReactNode } from "react";

import TopBar from "@/components/admin/TopBar";
import "./dashboard.css";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="dashboard-shell">
            

            <div className="dashboard-main">
                <TopBar />

                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    );
}