"use client";

import {
    FormEvent,
    useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type AccountExperienceProps = {
    email: string;
};

export default function AccountExperience({
    email,
}: AccountExperienceProps) {
    const router = useRouter();

    const [password, setPassword] =
        useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");
    const [showPassword, setShowPassword] =
        useState(false);
    const [errorMessage, setErrorMessage] =
        useState("");
    const [successMessage, setSuccessMessage] =
        useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);
    const [isSigningOut, setIsSigningOut] =
        useState(false);

    async function handlePasswordChange(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if (password.length < 8) {
            setErrorMessage(
                "Choose a password with at least 8 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage(
                "The passwords you entered don’t match."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const supabase = createClient();

            const { error } =
                await supabase.auth.updateUser({
                    password,
                });

            if (error) {
                console.error(
                    "Unable to change password:",
                    {
                        message: error.message,
                        code: error.code,
                        status: error.status,
                    }
                );

                throw new Error(
                    error.message
                );
            }

            setPassword("");
            setConfirmPassword("");
            setSuccessMessage(
                "Your password has been updated."
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "";

            if (
                message
                    .toLowerCase()
                    .includes("reauth")
            ) {
                setErrorMessage(
                    "For security, please sign out and use the password reset option on the login page."
                );
            } else {
                setErrorMessage(
                    "We couldn’t update your password. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSignOut() {
        setErrorMessage("");
        setSuccessMessage("");
        setIsSigningOut(true);

        const supabase = createClient();

        const { error } =
            await supabase.auth.signOut();

        if (error) {
            console.error(
                "Unable to sign out:",
                error
            );

            setErrorMessage(
                "We couldn’t sign you out. Please try again."
            );
            setIsSigningOut(false);
            return;
        }

        router.replace("/login");
        router.refresh();
    }

    return (
        <main className="account-page">
            <header className="account-header">
                <Link
                    href="/library"
                    className="account-back-link"
                >
                    ← Return to the library
                </Link>

                <div className="account-brand">
                    <div className="account-mark">
                        TLF
                    </div>

                    <p>To Living Free</p>
                </div>
            </header>

            <section className="account-intro">
                <p className="account-eyebrow">
                    Your library
                </p>

                <h1>Your account</h1>

                <p>
                    Manage the details you use to
                    return to your private library.
                </p>
            </section>

            <section className="account-panel">
                <div className="account-section">
                    <div className="account-section-heading">
                        <p className="account-section-number">
                            01
                        </p>

                        <div>
                            <h2>Sign-in details</h2>

                            <p>
                                The email connected
                                to your library.
                            </p>
                        </div>
                    </div>

                    <div className="account-email">
                        <span>Email address</span>
                        <strong>{email}</strong>
                    </div>
                </div>

                <div className="account-divider" />

                <div className="account-section">
                    <div className="account-section-heading">
                        <p className="account-section-number">
                            02
                        </p>

                        <div>
                            <h2>Change password</h2>

                            <p>
                                Choose a new password
                                for future visits.
                            </p>
                        </div>
                    </div>

                    <form
                        className="account-form"
                        onSubmit={
                            handlePasswordChange
                        }
                    >
                        <label className="account-field">
                            <span>New password</span>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={128}
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target
                                            .value
                                    )
                                }
                                required
                                disabled={
                                    isSubmitting
                                }
                            />
                        </label>

                        <label className="account-field">
                            <span>
                                Confirm new password
                            </span>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={128}
                                value={
                                    confirmPassword
                                }
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target
                                            .value
                                    )
                                }
                                required
                                disabled={
                                    isSubmitting
                                }
                            />
                        </label>

                        <label className="account-show-password">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={(event) =>
                                    setShowPassword(
                                        event.target
                                            .checked
                                    )
                                }
                                disabled={
                                    isSubmitting
                                }
                            />

                            <span>Show password</span>
                        </label>

                        <p className="account-password-hint">
                            Use at least 8 characters.
                        </p>

                        {errorMessage ? (
                            <p
                                className="account-message account-message-error"
                                role="alert"
                            >
                                {errorMessage}
                            </p>
                        ) : null}

                        {successMessage ? (
                            <p
                                className="account-message account-message-success"
                                role="status"
                            >
                                {successMessage}
                            </p>
                        ) : null}

                        <button
                            className="account-primary-button"
                            type="submit"
                            disabled={
                                isSubmitting ||
                                isSigningOut
                            }
                        >
                            {isSubmitting
                                ? "Updating your password…"
                                : "Update password"}
                        </button>
                    </form>
                </div>

                <div className="account-divider" />

                <div className="account-section account-signout-section">
                    <div className="account-section-heading">
                        <p className="account-section-number">
                            03
                        </p>

                        <div>
                            <h2>Leave the library</h2>

                            <p>
                                Sign out of this
                                device.
                            </p>
                        </div>
                    </div>

                    <button
                        className="account-secondary-button"
                        type="button"
                        onClick={handleSignOut}
                        disabled={
                            isSigningOut ||
                            isSubmitting
                        }
                    >
                        {isSigningOut
                            ? "Signing out…"
                            : "Sign out"}
                    </button>
                </div>
            </section>
        </main>
    );
}