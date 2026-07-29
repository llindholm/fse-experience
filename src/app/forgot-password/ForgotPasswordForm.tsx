"use client";

import {
    FormEvent,
    useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
    const [email, setEmail] =
        useState("");
    const [errorMessage, setErrorMessage] =
        useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);
    const [isComplete, setIsComplete] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const supabase = createClient();

            const redirectTo =
                `${window.location.origin}/reset-password`;

            const { error } =
                await supabase.auth
                    .resetPasswordForEmail(
                        email.trim(),
                        {
                            redirectTo,
                        }
                    );

            if (error) {
                console.error(
                    "Unable to send password reset:",
                    error
                );

                throw new Error(
                    "We couldn’t send the reset email. Please try again."
                );
            }

            setIsComplete(true);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "We couldn’t send the reset email. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isComplete) {
        return (
            <div className="admin-login-success">
                <h2>Check your inbox.</h2>

                <p>
                    If an account exists for that
                    email address, you’ll receive a
                    link to choose a new password.
                </p>

                <p>
                    You can close this page after
                    the email arrives.
                </p>
            </div>
        );
    }

    return (
        <form
            className="admin-login-form"
            onSubmit={handleSubmit}
        >
            <div className="admin-login-field">
                <label htmlFor="reset-email">
                    Email address
                </label>

                <input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(
                            event.target.value
                        )
                    }
                    required
                    disabled={isSubmitting}
                />
            </div>

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
                    ? "Sending your link…"
                    : "Send reset link"}
            </button>
        </form>
    );
}