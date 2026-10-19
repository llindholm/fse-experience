import "server-only";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findKeapContactByEmail } from "@/lib/keap/contacts";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    // Never allow this test endpoint in Production.
    if (process.env.VERCEL_ENV !== "preview") {
        return new Response(null, { status: 404 });
    }

    // Verify the caller's Supabase session.
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const token = authHeader.slice(7);
    const supabase = createAdminClient();

    const { data: authData, error: authError } =
        await supabase.auth.getUser(token);

    if (authError || !authData.user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    // Only administrators may run the test.
    const { data: profile, error: profileError } =
        await supabase
            .from("profiles")
            .select("role")
            .eq("id", authData.user.id)
            .single();

    if (
        profileError ||
        profile?.role !== "admin"
    ) {
        return NextResponse.json(
            { error: "Forbidden" },
            { status: 403 }
        );
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }

    const email =
        typeof body === "object" &&
        body !== null &&
        "email" in body &&
        typeof body.email === "string"
            ? body.email.trim().toLowerCase()
            : "";

    if (
        !email ||
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        return NextResponse.json(
            { error: "Invalid email" },
            { status: 400 }
        );
    }

    try {
        const contactId =
            await findKeapContactByEmail(email);

        return NextResponse.json({
            ok: true,
            contactFound: contactId !== null,
        });
    } catch (error) {
        console.error(
            "Keap lookup test failed",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error: "Keap lookup failed",
            },
            { status: 502 }
        );
    }
}