import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import "./dashboard.css";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="dashboard-shell">
            <Sidebar />

            <div className="dashboard-main">
                <TopBar />

                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    );
}