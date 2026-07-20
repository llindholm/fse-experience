"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
    const router = useRouter();

    async function handleSignOut() {
        const supabase = createClient();

        await supabase.auth.signOut();

        router.replace("/login");
        router.refresh();
    }

    return (
        <button
            type="button"
            className="dashboard-signout"
            onClick={handleSignOut}
        >
            Sign Out
        </button>
    );
}