import { redirect } from "next/navigation";

import AccountPasswordForm from "@/components/library/AccountPasswordForm";
import AccountSignOutButton from "@/components/library/AccountSignOutButton";
import LibraryHeader from "@/components/library/LibraryHeader";
import { createClient } from "@/lib/supabase/server";

import "./account.css";

export default async function AccountPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(
            "/login?next=/library/account"
        );
    }

    return (
        <main className="account-page">
            <LibraryHeader memberName="Account" />

            <section className="account-card">
                <p className="account-eyebrow">
                    Private Collection
                </p>

                <h1>Account</h1>

                <div className="account-section">
                    <div className="account-section-heading">
                        <h2>Sign-in details</h2>

                        <p>
                            The email connected to
                            your private library.
                        </p>
                    </div>

                    <div className="account-details">
                        <div className="account-detail">
                            <span>Email</span>

                            <strong>
                                {user.email ?? "—"}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="account-divider" />

                <div className="account-section">
                    <div className="account-section-heading">
                        <h2>Change password</h2>

                        <p>
                            Choose the password
                            you’ll use whenever you
                            return.
                        </p>
                    </div>

                    <AccountPasswordForm />
                </div>

                <div className="account-divider" />

                <div className="account-section">
                    <div className="account-section-heading">
                        <h2>Sign out</h2>

                        <p>
                            Sign out of your library
                            on this device.
                        </p>
                    </div>

                    <AccountSignOutButton />
                </div>
            </section>
        </main>
    );
}