import Link from "next/link";

import LibraryAccessForm from "@/components/library/LibraryAccessForm";

import "./access.css";

export default function LibraryAccessPage() {
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
                        Private Collection
                    </p>

                    <h1>Set up your access</h1>

                    <p>
                        Enter the email address used for
                        your purchase. We’ll send you a
                        secure link to create your
                        password and enter the library.
                    </p>
                </div>

                <LibraryAccessForm />

                <p className="library-access-login">
                    Already created your password?{" "}
                    <Link href="/login?next=/library">
                        Sign in
                    </Link>
                </p>
            </section>
        </main>
    );
}