"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import Link from "next/link";

type AdminLoginFormProps = {
    nextPath?: string;
};

export default function AdminLoginForm({
    nextPath = "/library",
}: AdminLoginFormProps) {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage("");
        setIsSubmitting(true);

        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        if (error) {
            setErrorMessage("That email or password wasn’t recognized.");
            setIsSubmitting(false);
            return;
        }

        router.replace(nextPath);
        router.refresh();
    }

    return (
        <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-login-field">
                <label htmlFor="admin-email">Email address</label>

                <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
            </div>

            <div className="admin-login-field">
                <label htmlFor="admin-password">Password</label>

                <input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </div>

            <div className="admin-login-field">
                <div className="admin-login-password-heading">
                    <label htmlFor="admin-password">
                        Password
                    </label>

                    <Link
                        href="/forgot-password"
                        className="admin-login-forgot"
                    >
                        Forgot your password?
                    </Link>
                </div>

                <input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    required
                />
            </div>

            {errorMessage ? (
                <p className="admin-login-error" role="alert">
                    {errorMessage}
                </p>
            ) : null}

            <button
                className="admin-login-submit"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Signing in…" : "Continue"}
            </button>
        </form>
    );
}