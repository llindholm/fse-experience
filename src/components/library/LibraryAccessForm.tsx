"use client";

import { FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function LibraryAccessForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setIsSubmitting(true);
        setMessage("");

        const supabase = createClient();

        const redirectTo =
            `${window.location.origin}` +
            "/auth/callback" +
            "?next=/library/update-password";

        const { error } =
            await supabase.auth.resetPasswordForEmail(
                email.trim().toLowerCase(),
                {
                    redirectTo,
                }
            );

        if (error) {
            setMessage(
                "We couldn’t send the access email. Please check the address and try again."
            );
            setIsSubmitting(false);
            return;
        }

        setMessage(
            "Check your inbox for your secure library access link."
        );
        setIsSubmitting(false);
    }

    return (
        <form
            className="library-access-form"
            onSubmit={handleSubmit}
        >
            <label>
                <span>Email address</span>

                <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    autoComplete="email"
                    required
                />
            </label>

            <button
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? "Sending..."
                    : "Send access link"}
            </button>

            {message ? (
                <p
                    className="library-access-message"
                    role="status"
                >
                    {message}
                </p>
            ) : null}
        </form>
    );
}