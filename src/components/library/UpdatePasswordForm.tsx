"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordForm() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] =
        useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");

        if (password.length < 8) {
            setMessage(
                "Please choose a password with at least eight characters."
            );
            return;
        }

        if (password !== confirmation) {
            setMessage(
                "The passwords do not match."
            );
            return;
        }

        setIsSubmitting(true);

        const supabase = createClient();

        const { error } =
            await supabase.auth.updateUser({
                password,
            });

        if (error) {
            setMessage(
                "We couldn’t save your password. Please request a new access link and try again."
            );
            setIsSubmitting(false);
            return;
        }

        router.replace("/library");
        router.refresh();
    }

    return (
        <form
            className="update-password-form"
            onSubmit={handleSubmit}
        >
            <label>
                <span>New password</span>

                <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
            </label>

            <label>
                <span>Confirm password</span>

                <input
                    type="password"
                    value={confirmation}
                    onChange={(event) =>
                        setConfirmation(
                            event.target.value
                        )
                    }
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
            </label>

            <button
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? "Saving..."
                    : "Create password"}
            </button>

            {message ? (
                <p role="status">{message}</p>
            ) : null}
        </form>
    );
}