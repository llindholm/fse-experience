import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/requireUser";

type LibraryLayoutProps = {
    children: ReactNode;
};

export default async function LibraryLayout({
    children,
}: LibraryLayoutProps) {
    await requireUser();

    return children;
}