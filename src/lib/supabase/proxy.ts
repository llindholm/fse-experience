import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
    request: NextRequest
) {
    let response = NextResponse.next({
        request,
    });

    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            "Missing public Supabase environment variables."
        );
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },

                setAll(cookiesToSet) {
                    cookiesToSet.forEach(
                        ({ name, value }) => {
                            request.cookies.set(
                                name,
                                value
                            );
                        }
                    );

                    response = NextResponse.next({
                        request,
                    });

                    cookiesToSet.forEach(
                        ({ name, value, options }) => {
                            response.cookies.set(
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

    /*
     * Do not remove this call. It verifies and refreshes
     * the authentication session when necessary.
     */
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

const isLibraryRoute =
    pathname === "/library" ||
    pathname.startsWith("/library/");

const isProtectedRoute =
    isAdminRoute || isLibraryRoute;

const isLoginRoute = pathname === "/login";

if (isProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/login";
    loginUrl.search = "";

    const requestedPath = `${pathname}${request.nextUrl.search}`;

    loginUrl.searchParams.set("next", requestedPath);

    return NextResponse.redirect(loginUrl);
}

if (isAdminRoute && user) {
    const {
        data: profile,
        error: profileError,
    } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
        console.error(
            "Unable to verify administrator role:",
            profileError
        );
    }

    if (profile?.role !== "admin") {
        const libraryUrl = request.nextUrl.clone();

        libraryUrl.pathname = "/library";
        libraryUrl.search = "";

        return NextResponse.redirect(libraryUrl);
    }
}

if (isLoginRoute && user) {
    const requestedNext =
        request.nextUrl.searchParams.get("next");

    let safeNext =
        requestedNext?.startsWith("/") &&
        !requestedNext.startsWith("//")
            ? requestedNext
            : "/library";

    const requestedPathname =
        safeNext.split("?")[0];

    const requestsAdmin =
        requestedPathname === "/admin" ||
        requestedPathname.startsWith("/admin/");

    if (requestsAdmin) {
        const {
            data: profile,
            error: profileError,
        } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();

        if (
            profileError ||
            profile?.role !== "admin"
        ) {
            safeNext = "/library";
        }
    }

    const destinationUrl =
        request.nextUrl.clone();

    const [destinationPath, query = ""] =
        safeNext.split("?");

    destinationUrl.pathname =
        destinationPath;

    destinationUrl.search =
        query ? `?${query}` : "";

    return NextResponse.redirect(
        destinationUrl
    );
}

return response;
}