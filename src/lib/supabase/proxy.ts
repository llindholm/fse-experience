import {
    createServerClient,
} from "@supabase/ssr";
import {
    NextResponse,
    type NextRequest,
} from "next/server";

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
                        ({
                            name,
                            value,
                            options,
                        }) => {
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
     * Preserve any refreshed Supabase cookies when
     * returning a redirect or rewrite response.
     */
    function withSessionCookies(
        destination: NextResponse
    ) {
        response.cookies
            .getAll()
            .forEach((cookie) => {
                destination.cookies.set(cookie);
            });

        return destination;
    }

    /*
     * Do not remove this call. It verifies and refreshes
     * the authentication session when necessary.
     */
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname =
        request.nextUrl.pathname;

    const hostname =
        request.nextUrl.hostname.toLowerCase();

    const isLibraryHostname =
        hostname ===
        "library.tolivingfree.com" ||
        hostname === "library.localhost";

    const isAdminRoute =
        pathname === "/admin" ||
        pathname.startsWith("/admin/");

    const isLibraryRoute =
        pathname === "/library" ||
        pathname.startsWith("/library/");

    const isProtectedRoute =
        isAdminRoute || isLibraryRoute;

    const isLoginRoute =
        pathname === "/login";

    /*
     * The root of library.tolivingfree.com is the
     * member entry point.
     *
     * Signed out:
     * library.tolivingfree.com
     * → library.tolivingfree.com/login
     *
     * Signed in:
     * library.tolivingfree.com
     * → internally renders /library while keeping
     * the clean subdomain URL in the address bar.
     */
    if (
        isLibraryHostname &&
        pathname === "/"
    ) {
        if (!user) {
            const loginUrl =
                request.nextUrl.clone();

            loginUrl.pathname = "/login";
            loginUrl.search = "";
            loginUrl.searchParams.set(
                "next",
                "/"
            );

            return withSessionCookies(
                NextResponse.redirect(loginUrl)
            );
        }

        const libraryUrl =
            request.nextUrl.clone();

        libraryUrl.pathname = "/library";
        libraryUrl.search = "";

        return withSessionCookies(
            NextResponse.rewrite(libraryUrl)
        );
    }

    /*
     * Protect member-library and admin routes.
     */
    if (isProtectedRoute && !user) {
        const loginUrl =
            request.nextUrl.clone();

        loginUrl.pathname = "/login";
        loginUrl.search = "";

        const requestedPath =
            `${pathname}${request.nextUrl.search}`;

        loginUrl.searchParams.set(
            "next",
            requestedPath
        );

        return withSessionCookies(
            NextResponse.redirect(loginUrl)
        );
    }

    /*
     * Only administrators may access /admin.
     */
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
            const libraryUrl =
                request.nextUrl.clone();

            libraryUrl.pathname =
                isLibraryHostname
                    ? "/"
                    : "/library";

            libraryUrl.search = "";

            return withSessionCookies(
                NextResponse.redirect(
                    libraryUrl
                )
            );
        }
    }

    /*
     * A signed-in user does not need to see /login.
     */
    if (isLoginRoute && user) {
        const requestedNext =
            request.nextUrl.searchParams.get(
                "next"
            );

        let safeNext =
            requestedNext?.startsWith("/") &&
                !requestedNext.startsWith("//")
                ? requestedNext
                : isLibraryHostname
                    ? "/"
                    : "/library";

        const requestedPathname =
            safeNext.split("?")[0];

        const requestsAdmin =
            requestedPathname === "/admin" ||
            requestedPathname.startsWith(
                "/admin/"
            );

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
                safeNext =
                    isLibraryHostname
                        ? "/"
                        : "/library";
            }
        }

        /*
         * Keep the clean root URL when someone signs
         * in through library.tolivingfree.com/login.
         */
        if (
            isLibraryHostname &&
            safeNext === "/library"
        ) {
            safeNext = "/";
        }

        const destinationUrl =
            request.nextUrl.clone();

        const [
            destinationPath,
            query = "",
        ] = safeNext.split("?");

        destinationUrl.pathname =
            destinationPath;

        destinationUrl.search =
            query ? `?${query}` : "";

        return withSessionCookies(
            NextResponse.redirect(
                destinationUrl
            )
        );
    }

    return response;
}