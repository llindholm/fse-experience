"use client";

import {
    FormEvent,
    useState,
} from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

import styles from "./welcome.module.css";

type InvalidReason =
    | "not_found"
    | "expired"
    | "used"
    | "superseded";

type WelcomeInitialState =
    | {
        status: "ready";
        token: string;
        firstName: string | null;
    }
    | {
        status: "invalid";
        reason: InvalidReason;
    }
    | {
        status: "error";
    };

type WelcomeExperienceProps = {
    initialState: WelcomeInitialState;
};

type CompleteWelcomeResponse = {
    ok: boolean;
    email?: string;
    memberId?: string;
    code?: string;
    error?: string;
};

function InvalidWelcome({
    reason,
}: {
    reason: InvalidReason;
}) {
    if (reason === "used") {
        return (
            <WelcomeMessage
                eyebrow="Your library"
                title="You’re already set up."
                body="Your welcome invitation has already been completed. Sign in with the password you chose to return to your library."
                action={
                    <Link
                        href="/login"
                        className={styles.primaryLink}
                    >
                        Sign in
                    </Link>
                }
            />
        );
    }

    if (reason === "superseded") {
        return (
            <WelcomeMessage
                eyebrow="A newer invitation"
                title="There’s a newer way in."
                body="We’ve sent you a more recent welcome email. Please use the Enter the Library button in the newest email you received."
            />
        );
    }

    if (reason === "expired") {
        return (
            <WelcomeMessage
                eyebrow="Your invitation"
                title="This invitation has expired."
                body="Your library is still here. Please contact us and we’ll send you a fresh invitation."
            />
        );
    }

    return (
        <WelcomeMessage
            eyebrow="Your invitation"
            title="This link isn’t available."
            body="The welcome link may be incomplete or no longer valid. Please return to the email we sent and try the Enter the Library button again."
        />
    );
}

function WelcomeMessage({
    eyebrow,
    title,
    body,
    action,
}: {
    eyebrow: string;
    title: string;
    body: string;
    action?: React.ReactNode;
}) {
    return (
        <main className={styles.page}>
            <section className={styles.messagePanel}>
                <p className={styles.eyebrow}>
                    {eyebrow}
                </p>

                <h1 className={styles.messageTitle}>
                    {title}
                </h1>

                <p className={styles.messageBody}>
                    {body}
                </p>

                {action ? (
                    <div className={styles.messageAction}>
                        {action}
                    </div>
                ) : null}
            </section>
        </main>
    );
}

export function WelcomeExperience({
    initialState,
}: WelcomeExperienceProps) {
    if (initialState.status === "invalid") {
        return (
            <InvalidWelcome
                reason={initialState.reason}
            />
        );
    }

    if (initialState.status === "error") {
        return (
            <WelcomeMessage
                eyebrow="Your library"
                title="We couldn’t open your invitation."
                body="Something interrupted the connection. Please refresh this page and try again."
            />
        );
    }

    return (
        <WelcomeSetup
            token={initialState.token}
            firstName={initialState.firstName}
        />
    );
}

function WelcomeSetup({
    token,
    firstName,
}: {
    token: string;
    firstName: string | null;
}) {
    const [password, setPassword] =
        useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");
    const [showPassword, setShowPassword] =
        useState(false);
    const [error, setError] =
        useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] =
        useState(false);
    const [isComplete, setIsComplete] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError(
                "Choose a password with at least 8 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                "The passwords you entered don’t match."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                "/api/auth/welcome/complete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        password,
                    }),
                }
            );

            const result =
                (await response.json()) as
                CompleteWelcomeResponse;

            if (
                !response.ok ||
                !result.ok ||
                !result.email
            ) {
                throw new Error(
                    result.error ??
                    "We couldn’t finish setting up your library."
                );
            }

            const supabase = createClient();

            const {
                data: signInData,
                error: signInError,
            } = await supabase.auth.signInWithPassword({
                email: result.email,
                password,
            });

            if (signInError) {
                console.error(
                    "Automatic welcome sign-in failed",
                    {
                        message: signInError.message,
                        code: signInError.code,
                        status: signInError.status,
                        email: result.email,
                    }
                );

                throw new Error(
                    `Your password was created, but sign-in failed: ${signInError.message}`
                );
            }

            if (!signInData.session) {
                console.error(
                    "Welcome sign-in returned no session",
                    {
                        email: result.email,
                        hasUser: Boolean(signInData.user),
                    }
                );

                throw new Error(
                    "Your password was created, but no login session was returned."
                );
            }

            /*
             * Remove the raw welcome token from the
             * browser address bar and history.
             */
            window.history.replaceState(
                {},
                "",
                "/welcome"
            );

            setPassword("");
            setConfirmPassword("");
            setIsComplete(true);
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "We couldn’t finish setting up your library."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isComplete) {
        return (
            <main className={styles.page}>
                <section
                    className={styles.completePanel}
                >
                    <p className={styles.eyebrow}>
                        To Living Free
                    </p>

                    <h1 className={styles.completeTitle}>
                        {firstName
                            ? `Welcome, ${firstName}.`
                            : "Welcome."}
                    </h1>

                    <p className={styles.completeLead}>
                        Your library is ready.
                    </p>

                    <div
                        className={
                            styles.completeDivider
                        }
                    />

                    <p className={styles.completeBody}>
                        Everything you’ve invested in
                        is waiting for you—available
                        whenever you need it, and
                        designed to meet you wherever
                        you are in the work.
                    </p>

                    <Link
                        href="/library"
                        className={styles.primaryLink}
                    >
                        Enter your library
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <section className={styles.intro}>
                <p className={styles.eyebrow}>
                    To Living Free
                </p>

                <h1 className={styles.title}>
                    Welcome.
                </h1>

                <p className={styles.lead}>
                    Your private library is ready.
                </p>

                <p className={styles.body}>
                    Inside you’ll find the courses
                    you’ve invested in, available
                    whenever you need them.
                </p>
            </section>

            <section className={styles.setup}>
                <div className={styles.setupLine} />

                <p className={styles.setupIntro}>
                    Before we begin, choose the
                    password you’ll use each time
                    you return.
                </p>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <label className={styles.field}>
                        <span
                            className={
                                styles.fieldLabel
                            }
                        >
                            Choose your password
                        </span>

                        <input
                            className={styles.input}
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            autoComplete="new-password"
                            minLength={8}
                            maxLength={128}
                            required
                            disabled={isSubmitting}
                        />
                    </label>

                    <label className={styles.field}>
                        <span
                            className={
                                styles.fieldLabel
                            }
                        >
                            Confirm your password
                        </span>

                        <input
                            className={styles.input}
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            autoComplete="new-password"
                            minLength={8}
                            maxLength={128}
                            required
                            disabled={isSubmitting}
                        />
                    </label>

                    <label
                        className={
                            styles.showPassword
                        }
                    >
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

                    <p className={styles.passwordHint}>
                        Use at least 8 characters.
                    </p>

                    {error ? (
                        <p
                            className={styles.formError}
                            role="alert"
                        >
                            {error}
                        </p>
                    ) : null}

                    <button
                        className={styles.submitButton}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Preparing your library…"
                            : "Continue"}
                    </button>
                </form>
            </section>
        </main>
    );
}