import { redirect } from "next/navigation";

import AccountSignOutButton from "@/components/library/AccountSignOutButton";
import { createClient } from "@/lib/supabase/server";

import "./account.css";
import LibraryHeader from "@/components/library/LibraryHeader";

export default async function AccountPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/library/account");
    }

    return (
        <main className="account-page">
            <LibraryHeader memberName="Account" />

            <section className="account-card">
                <p className="account-eyebrow">
                    Private Collection
                </p>

                <h1>Account</h1>

                <div className="account-details">
                    <div className="account-detail">
                        <span>Email</span>
                        <strong>{user.email ?? "—"}</strong>
                    </div>
                </div>

                <AccountSignOutButton />
            </section>
        </main>
    );
}