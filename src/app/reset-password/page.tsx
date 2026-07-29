import ResetPasswordForm from "./ResetPasswordForm";

import "../login/login.css";

export default function ResetPasswordPage() {
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

                    <h1>Choose a new password</h1>

                    <p>
                        Choose the password you’ll
                        use whenever you return to
                        your private library.
                    </p>
                </div>

                <ResetPasswordForm />
            </section>
        </main>
    );
}