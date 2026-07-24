import type { Metadata } from "next";

import { WelcomeExperience } from "./welcome-experience";

import { validateWelcomeToken } from "@/lib/auth/welcome-token";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Welcome | To Living Free",
    description:
        "Set up your private To Living Free Library.",
    robots: {
        index: false,
        follow: false,
    },
};

type WelcomePageProps = {
    searchParams: Promise<{
        token?: string | string[];
    }>;
};

function readToken(
    value: string | string[] | undefined
): string {
    if (typeof value === "string") {
        return value.trim();
    }

    return "";
}

export default async function WelcomePage({
    searchParams,
}: WelcomePageProps) {
    const resolvedSearchParams =
        await searchParams;

    const token = readToken(
        resolvedSearchParams.token
    );

    if (!token) {
        return (
            <WelcomeExperience
                initialState={{
                    status: "invalid",
                    reason: "not_found",
                }}
            />
        );
    }

    try {
        const validation =
            await validateWelcomeToken(token);

        if (!validation.valid) {
            return (
                <WelcomeExperience
                    initialState={{
                        status: "invalid",
                        reason: validation.reason,
                    }}
                />
            );
        }

        const supabase = createAdminClient();

        const { data: profile } = await supabase
            .from("profiles")
            .select("first_name")
            .eq("id", validation.memberId)
            .maybeSingle<{
                first_name: string | null;
            }>();

        return (
            <WelcomeExperience
                initialState={{
                    status: "ready",
                    token,
                    firstName:
                        profile?.first_name?.trim() ||
                        null,
                }}
            />
        );
    } catch (error) {
        console.error(
            "Unable to prepare welcome page",
            error
        );

        return (
            <WelcomeExperience
                initialState={{
                    status: "error",
                }}
            />
        );
    }
}