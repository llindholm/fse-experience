import { redirect } from "next/navigation";

import UpdatePasswordForm from "@/components/library/UpdatePasswordForm";
import { createClient } from "@/lib/supabase/server";

import "../access/access.css";

export default async function UpdatePasswordPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/library/access");
    }

    return (
        <main className="library-access-page">
            <section className="library-access-card">
                <div className="library-access-brand">
                    <div className="library-access-mark">
                        TLF
                    </div>

                    <p>To Living Free</p>
                </div>

                <div className="library-access-intro">
                    <p className="library-access-eyebrow">
                        Your library
                    </p>

                    <h1>Create your password</h1>

                    <p>
                        Choose the password you’ll use
                        whenever you return to your
                        private library.
                    </p>
                </div>

                <UpdatePasswordForm />
            </section>
        </main>
    );
}