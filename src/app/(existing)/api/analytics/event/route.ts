import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const allowedEvents = new Set([
    "page_view",
    "chapter_view",
    "scroll_depth",
    "enrollment_open",
    "enrollment_close",
    "checkout_click",
]);

type AnalyticsEventBody = {
    site?: unknown;
    pagePath?: unknown;
    eventName?: unknown;
    visitorId?: unknown;
    sessionId?: unknown;
    sectionId?: unknown;
    eventValue?: unknown;
    referrer?: unknown;
    utmSource?: unknown;
    utmMedium?: unknown;
    utmCampaign?: unknown;
    utmContent?: unknown;
    utmTerm?: unknown;
    deviceType?: unknown;
    metadata?: unknown;
};

function optionalString(value: unknown, maxLength = 500) {
    if (typeof value !== "string") return null;

    const trimmed = value.trim();

    if (!trimmed) return null;

    return trimmed.slice(0, maxLength);
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as AnalyticsEventBody;

        const site = optionalString(body.site, 100);
        const pagePath = optionalString(body.pagePath, 500);
        const eventName = optionalString(body.eventName, 100);
        const visitorId = optionalString(body.visitorId, 150);
        const sessionId = optionalString(body.sessionId, 150);

        if (
            !site ||
            !pagePath ||
            !eventName ||
            !visitorId ||
            !sessionId
        ) {
            return NextResponse.json(
                { error: "Missing required analytics fields." },
                { status: 400 }
            );
        }

        if (!allowedEvents.has(eventName)) {
            return NextResponse.json(
                { error: "Unsupported analytics event." },
                { status: 400 }
            );
        }

        const eventValue =
            typeof body.eventValue === "number" &&
                Number.isFinite(body.eventValue)
                ? body.eventValue
                : null;

        const metadata =
            body.metadata &&
                typeof body.metadata === "object" &&
                !Array.isArray(body.metadata)
                ? body.metadata
                : {};

        const { error } = await supabaseAdmin
            .from("analytics_events")
            .insert({
                site,
                page_path: pagePath,
                event_name: eventName,
                visitor_id: visitorId,
                session_id: sessionId,

                section_id: optionalString(body.sectionId, 150),
                event_value: eventValue,

                referrer: optionalString(body.referrer, 1000),

                utm_source: optionalString(body.utmSource, 250),
                utm_medium: optionalString(body.utmMedium, 250),
                utm_campaign: optionalString(body.utmCampaign, 250),
                utm_content: optionalString(body.utmContent, 250),
                utm_term: optionalString(body.utmTerm, 250),

                device_type: optionalString(body.deviceType, 50),

                metadata,
            });

        if (error) {
            console.error("Supabase analytics insert failed:", error);

            return NextResponse.json(
                { error: "Unable to record analytics event." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics route failed:", error);

        return NextResponse.json(
            { error: "Invalid analytics request." },
            { status: 400 }
        );
    }
}