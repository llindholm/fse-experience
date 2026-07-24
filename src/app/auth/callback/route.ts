import { NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSafeNextPath(value: string | null) {
    if (
        value?.startsWith("/") &&
        !value.startsWith("//")
    ) {
        return value;
    }

    return "/library";
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);

    const code =
        requestUrl.searchParams.get("code");

    const nextPath = getSafeNextPath(
        requestUrl.searchParams.get("next")
    );

    if (!code) {
        return NextResponse.redirect(
            new URL(
                "/library/access?error=invalid-link",
                requestUrl.origin
            )
        );
    }

    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.redirect(
            new URL(
                "/library/access?error=configuration",
                requestUrl.origin
            )
        );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(
                        ({
                            name,
                            value,
                            options,
                        }) => {
                            cookieStore.set(
                                name,
                                value,
                                options
                            );
                        }
                    );
                },
            },
        }
    );

    const { error } =
        await supabase.auth.exchangeCodeForSession(
            code
        );

    if (error) {
        return NextResponse.redirect(
            new URL(
                "/library/access?error=expired-link",
                requestUrl.origin
            )
        );
    }

    return NextResponse.redirect(
        new URL(nextPath, requestUrl.origin)
    );
}