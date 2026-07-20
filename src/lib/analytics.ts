export type AnalyticsEventName =
    | "page_view"
    | "chapter_view"
    | "scroll_depth"
    | "enrollment_open"
    | "enrollment_close"
    | "checkout_click";

type TrackEventOptions = {
    sectionId?: string;
    eventValue?: number;
    metadata?: Record<string, unknown>;
};

const VISITOR_ID_KEY = "tlf_visitor_id";
const SESSION_ID_KEY = "tlf_session_id";

function createId(prefix: "visitor" | "session") {
    const uuid =
        typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;

    return `${prefix}_${uuid}`;
}

export function getVisitorId() {
    let visitorId = window.localStorage.getItem(VISITOR_ID_KEY);

    if (!visitorId) {
        visitorId = createId("visitor");
        window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }

    return visitorId;
}

export function getSessionId() {
    let sessionId = window.sessionStorage.getItem(SESSION_ID_KEY);

    if (!sessionId) {
        sessionId = createId("session");
        window.sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }

    return sessionId;
}

function getDeviceType() {
    const width = window.innerWidth;

    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";

    return "desktop";
}

function getCampaignData() {
    const params = new URLSearchParams(window.location.search);

    return {
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
        utmContent: params.get("utm_content"),
        utmTerm: params.get("utm_term"),
    };
}

export async function trackEvent(
    eventName: AnalyticsEventName,
    options: TrackEventOptions = {}
) {
    try {
        const campaign = getCampaignData();

        const response = await fetch("/api/analytics/event", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            keepalive: true,
            body: JSON.stringify({
                site: "fse",
                pagePath: window.location.pathname,
                eventName,
                visitorId: getVisitorId(),
                sessionId: getSessionId(),
                sectionId: options.sectionId,
                eventValue: options.eventValue,
                referrer: document.referrer || null,
                deviceType: getDeviceType(),
                metadata: {
                    viewportWidth: window.innerWidth,
                    viewportHeight: window.innerHeight,
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height,
                    ...options.metadata,
                },
                ...campaign,
            }),
        });

        if (!response.ok) {
            console.error(
                "Analytics event failed:",
                eventName,
                response.status
            );
        }
    } catch (error) {
        console.error("Unable to send analytics event:", error);
    }
}