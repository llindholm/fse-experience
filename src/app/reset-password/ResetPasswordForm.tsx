"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type RecoveryStatus =
    | "checking"
    | "ready"
    | "invalid";

export default function ResetPasswordForm() {
    const router = useRouter();

    const [status, setStatus] =
        useState<RecoveryStatus>("checking");
    const [password, setPassword] =
        useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");
    const [showPassword, setShowPassword] =
        useState(false);
    const [errorMessage, setErrorMessage] =
        useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);
    const [isComplete, setIsComplete] =
        useState(false);

    useEffect(() => {
        const supabase = createClient();

        let mounted = true;

        async function checkRecoverySession() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!mounted) {
                return;
            }

            if (session) {
                setStatus("ready");
            }
        }

        void checkRecoverySession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!mounted) {
                    return;
                }

                if (
                    event ===
                    "PASSWORD_RECOVERY" ||
                    (event === "SIGNED_IN" &&
                        session)
                ) {
                    setStatus("ready");
                }
            }
        );

        const timeout = window.setTimeout(
            () => {
                if (mounted) {
                    setStatus((current) =>
                        current === "checking"
                            ? "invalid"
                            : current
                    );
                }
            },
            4000
        );

        return () => {
            mounted = false;
            window.clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setErrorMessage("");

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
                    "Unable to update password:",
                    error
                );

                throw new Error(
                    "We couldn’t update your password. Please request a new reset link and try again."
                );
            }

            setPassword("");
            setConfirmPassword("");
            setIsComplete(true);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "We couldn’t update your password."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (status === "checking") {
        return (
            <p className="admin-login-status">
                Opening your secure reset link…
            </p>
        );
    }

    if (status === "invalid") {
        return (
            <div className="admin-login-success">
                <h2>This link isn’t available.</h2>

                <p>
                    It may have expired or already
                    been used.
                </p>

                <Link href="/forgot-password">
                    Request a new reset link
                </Link>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="admin-login-success">
                <h2>Your password is ready.</h2>

                <p>
                    You can now return to your
                    library using your new password.
                </p>

                <button
                    className="admin-login-submit"
                    type="button"
                    onClick={() => {
                        router.replace("/library");
                        router.refresh();
                    }}
                >
                    Enter the Library
                </button>
            </div>
        );
    }

    return (
        <form
            className="admin-login-form"
            onSubmit={handleSubmit}
        >
            <div className="admin-login-field">
                <label htmlFor="new-password">
                    New password
                </label>

                <input
                    id="new-password"
                    name="new-password"
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
                            event.target.value
                        )
                    }
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div className="admin-login-field">
                <label htmlFor="confirm-password">
                    Confirm new password
                </label>

                <input
                    id="confirm-password"
                    name="confirm-password"
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(
                            event.target.value
                        )
                    }
                    required
                    disabled={isSubmitting}
                />
            </div>

            <label className="admin-login-show-password">
                <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(event) =>
                        setShowPassword(
                            event.target.checked
                        )
                    }
                    disabled={isSubmitting}
                />

                <span>Show password</span>
            </label>

            <p className="admin-login-password-hint">
                Use at least 8 characters.
            </p>

            {errorMessage ? (
                <p
                    className="admin-login-error"
                    role="alert"
                >
                    {errorMessage}
                </p>
            ) : null}

            <button
                className="admin-login-submit"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? "Saving your password…"
                    : "Save new password"}
            </button>
        </form>
    );
}