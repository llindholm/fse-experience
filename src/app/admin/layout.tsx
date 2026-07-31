import type { ReactNode } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth/requireAdmin";

import "./admin-shell.css";

type AdminLayoutProps = {
    children: ReactNode;
};

export default async function AdminLayout({
    children,
}: AdminLayoutProps) {
    await requireAdmin();

    return (
        <div className="admin-shell">
            <AdminSidebar />

            <div className="admin-shell__content">
                {children}
            </div>
        </div>
    );
}