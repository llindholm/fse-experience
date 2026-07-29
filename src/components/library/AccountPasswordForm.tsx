"use client";

import {
    FormEvent,
    useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

export default function AccountPasswordForm() {
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

    async function handleSubmit(
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
                    "Unable to update password:",
                    {
                        message: error.message,
                        code: error.code,
                        status: error.status,
                    }
                );

                throw error;
            }

            setPassword("");
            setConfirmPassword("");
            setSuccessMessage(
                "Your password has been updated."
            );
        } catch {
            setErrorMessage(
                "We couldn’t update your password. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            className="account-password-form"
            onSubmit={handleSubmit}
        >
            <label className="account-password-field">
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
                            event.target.value
                        )
                    }
                    required
                    disabled={isSubmitting}
                />
            </label>

            <label className="account-password-field">
                <span>Confirm new password</span>

                <input
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
            </label>

            <label className="account-show-password">
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
                className="account-password-submit"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? "Updating password…"
                    : "Update password"}
            </button>
        </form>
    );
}