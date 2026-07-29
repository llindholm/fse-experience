import Link from "next/link";

import ForgotPasswordForm from "./ForgotPasswordForm";

import "../login/login.css";

export default function ForgotPasswordPage() {
    return (
        <main className="admin-login-page">
            <section className="admin-login-card">
                <div className="admin-login-brand">
                    <div className="admin-login-mark">
                        TLF
                    </div>

                    <p>To Living Free</p>
                </div>

                <div className="admin-login-intro">
                    <p className="admin-login-eyebrow">
                        Your library
                    </p>

                    <h1>Reset your password</h1>

                    <p>
                        Enter the email address you
                        use for your library and
                        we’ll send you a secure link
                        to choose a new password.
                    </p>
                </div>

                <ForgotPasswordForm />

                <div className="admin-login-return">
                    <Link href="/login">
                        Return to sign in
                    </Link>
                </div>
            </section>
        </main>
    );
}