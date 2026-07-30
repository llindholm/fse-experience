import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";


export type OverviewMetrics = {
    visitors: number;
    sessions: number;
    averageScroll: number;
    enrollmentOpens: number;
    checkoutClicks: number;
    clickConversion: number;
};

export type ChapterProgressMetric = {
    id: string;
    title: string;
    percentage: number;
    visitors: number;
};

export type DailyVisitorMetric = {
    date: string;
    label: string;
    visitors: number;
    sessions: number;
};

export type FunnelStageMetric = {
    id: string;
    label: string;
    visitors: number;
    percentageOfVisitors: number;
    conversionFromPrevious: number | null;
};

export type SessionJourneyEvent = {
    id: string;
    eventName: string;
    label: string;
    sectionId: string | null;
    occurredAt: string;
    occurredAtLabel: string;
    elapsedSeconds: number;
    elapsedLabel: string;
};

export type RecentSessionMetric = {
    sessionId: string;
    visitorId: string;
    visitorLabel: string;
    startedAt: string;
    startedAtLabel: string;
    device: string;
    deepestChapterId: string | null;
    deepestChapterTitle: string;
    deepestChapterNumber: number;
    durationSeconds: number;
    durationLabel: string;
    outcome: "checkout" | "enrollment" | "left";
    events: SessionJourneyEvent[];
};
type FullAnalyticsRow = {
    visitor_id: string;
    session_id: string;
    event_name: string;
    event_value: number | null;
    section_id: string | null;
    created_at: string;
    device_type: string | null;
};

async function getAllAnalyticsEvents({
    eventNames,
    startDate,
}: {
    eventNames: string[];
    startDate?: string;
}): Promise<FullAnalyticsRow[]> {
    const pageSize = 1000;
    const rows: FullAnalyticsRow[] = [];

    let from = 0;

    while (true) {
        let query = supabaseAdmin
            .from("analytics_events")
            .select(
                [
                    "visitor_id",
                    "session_id",
                    "event_name",
                    "event_value",
                    "section_id",
                    "created_at",
                    "device_type",
                ].join(", ")
            )
            .eq("site", "fse")
            .in("event_name", eventNames)
            .order("created_at", {
                ascending: true,
            })
            .range(from, from + pageSize - 1);

        if (startDate) {
            query = query.gte("created_at", startDate);
        }

        const { data, error } =
            await query.returns<FullAnalyticsRow[]>();

        if (error) {
            throw new Error(
                `Unable to load analytics events: ${error.message}`
            );
        }

        const page = data ?? [];

        rows.push(...page);

        if (page.length < pageSize) {
            break;
        }

        from += pageSize;
    }

    return rows;
}


const EMPTY_METRICS: OverviewMetrics = {
    visitors: 0,
    sessions: 0,
    averageScroll: 0,
    enrollmentOpens: 0,
    checkoutClicks: 0,
    clickConversion: 0,
};

const FSE_CHAPTERS = [
    {
        id: "chapter-1",
        title: "The invisible ceiling",
    },
    {
        id: "chapter-2",
        title: "The real reason",
    },
    {
        id: "chapter-3",
        title: "The authority shift",
    },
    {
        id: "chapter-4",
        title: "Demand begins",
    },
    {
        id: "chapter-5",
        title: "The engine",
    },
    {
        id: "chapter-6",
        title: "The transformation",
    },
    {
        id: "chapter-7",
        title: "The experience",
    },
    {
        id: "chapter-8",
        title: "The proof",
    },
    {
        id: "chapter-9",
        title: "Your invitation",
    },
] as const;

export async function getOverviewMetrics(): Promise<OverviewMetrics> {
    let rows: FullAnalyticsRow[];

    try {
        rows = await getAllAnalyticsEvents({
            eventNames: [
                "page_view",
                "scroll_depth",
                "enrollment_open",
                "checkout_click",
            ],
        });
    } catch (error) {
        console.error(
            "Unable to load dashboard overview metrics:",
            error
        );

        return EMPTY_METRICS;
    }

    const pageViews = rows.filter((row) => row.event_name === "page_view");

    const visitorIds = new Set(pageViews.map((row) => row.visitor_id));
    const sessionIds = new Set(pageViews.map((row) => row.session_id));

    const enrollmentOpenSessions = new Set(
        rows
            .filter((row) => row.event_name === "enrollment_open")
            .map((row) => row.session_id)
    );

    const checkoutClickSessions = new Set(
        rows
            .filter((row) => row.event_name === "checkout_click")
            .map((row) => row.session_id)
    );

    const checkoutVisitors = new Set(
        rows
            .filter((row) => row.event_name === "checkout_click")
            .map((row) => row.visitor_id)
    );

    /*
     * Each session may generate several scroll events:
     * 10, 25, 50, 75, 90 and 100.
     *
     * We retain only the deepest threshold reached by each session,
     * then average those session maximums.
     */
    const deepestScrollBySession = new Map<string, number>();

    rows
        .filter(
            (row) =>
                row.event_name === "scroll_depth" &&
                typeof row.event_value === "number"
        )
        .forEach((row) => {
            const currentDepth =
                deepestScrollBySession.get(row.session_id) ?? 0;

            deepestScrollBySession.set(
                row.session_id,
                Math.max(currentDepth, row.event_value ?? 0)
            );
        });

    /*
     * Sessions without a recorded scroll threshold count as 0%.
     * This prevents the average from including only highly engaged sessions.
     */
    const scrollTotal = [...sessionIds].reduce((total, sessionId) => {
        return total + (deepestScrollBySession.get(sessionId) ?? 0);
    }, 0);

    const averageScroll =
        sessionIds.size > 0
            ? Math.round(scrollTotal / sessionIds.size)
            : 0;

    const clickConversion =
        visitorIds.size > 0
            ? Number(
                ((checkoutVisitors.size / visitorIds.size) * 100).toFixed(1)
            )
            : 0;

    return {
        visitors: visitorIds.size,
        sessions: sessionIds.size,
        averageScroll,
        enrollmentOpens: enrollmentOpenSessions.size,
        checkoutClicks: checkoutClickSessions.size,
        clickConversion,
    };
}


export async function getChapterProgression(): Promise<
    ChapterProgressMetric[]
> {
    let rows: FullAnalyticsRow[];

    try {
        rows = await getAllAnalyticsEvents({
            eventNames: [
                "page_view",
                "chapter_view",
            ],
        });
    } catch (error) {
        console.error(
            "Unable to load chapter progression:",
            error
        );

        return FSE_CHAPTERS.map((chapter) => ({
            ...chapter,
            percentage: 0,
            visitors: 0,
        }));
    }

    const allVisitors = new Set(
        rows
            .filter((row) => row.event_name === "page_view")
            .map((row) => row.visitor_id)
    );

    const visitorCount = allVisitors.size;

    return FSE_CHAPTERS.map((chapter) => {
        const chapterVisitors = new Set(
            rows
                .filter(
                    (row) =>
                        row.event_name === "chapter_view" &&
                        row.section_id === chapter.id &&
                        allVisitors.has(row.visitor_id)
                )
                .map((row) => row.visitor_id)
        );

        const percentage =
            visitorCount > 0
                ? Math.min(
                    100,
                    Math.round((chapterVisitors.size / visitorCount) * 100)
                )
                : 0;

        return {
            ...chapter,
            percentage,
            visitors: chapterVisitors.size,
        };
    });
}


function formatDateKey(date: Date) {
    return date.toISOString().slice(0, 10);
}

function formatDateLabel(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    }).format(date);
}

export async function getDailyVisitorTrend(
    days = 30
): Promise<DailyVisitorMetric[]> {
    const safeDays = Math.max(1, Math.min(days, 90));

    const startDate = new Date();

    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(
        startDate.getUTCDate() - (safeDays - 1)
    );

    let rows: FullAnalyticsRow[];

    try {
        rows = await getAllAnalyticsEvents({
            eventNames: ["page_view"],
            startDate: startDate.toISOString(),
        });
    } catch (error) {
        console.error(
            "Unable to load daily visitor trend:",
            error
        );

        return [];
    }

    const visitorsByDate = new Map<string, Set<string>>();
    const sessionsByDate = new Map<string, Set<string>>();

    rows.forEach((row) => {
        const dateKey = formatDateKey(new Date(row.created_at));

        if (!visitorsByDate.has(dateKey)) {
            visitorsByDate.set(dateKey, new Set());
        }

        if (!sessionsByDate.has(dateKey)) {
            sessionsByDate.set(dateKey, new Set());
        }

        visitorsByDate.get(dateKey)?.add(row.visitor_id);
        sessionsByDate.get(dateKey)?.add(row.session_id);
    });

    return Array.from({ length: safeDays }, (_, index) => {
        const date = new Date(startDate);

        date.setUTCDate(startDate.getUTCDate() + index);

        const dateKey = formatDateKey(date);

        return {
            date: dateKey,
            label: formatDateLabel(date),
            visitors: visitorsByDate.get(dateKey)?.size ?? 0,
            sessions: sessionsByDate.get(dateKey)?.size ?? 0,
        };
    });
}


export async function getSalesFunnel(): Promise<FunnelStageMetric[]> {
    let rows: FullAnalyticsRow[];

    try {
        rows = await getAllAnalyticsEvents({
            eventNames: [
                "page_view",
                "chapter_view",
                "enrollment_open",
                "checkout_click",
            ],
        });
    } catch (error) {
        console.error(
            "Unable to load sales funnel:",
            error
        );

        return [
            {
                id: "visitors",
                label: "Visitors",
                visitors: 0,
                percentageOfVisitors: 0,
                conversionFromPrevious: null,
            },
            {
                id: "chapter-5",
                label: "Reached Chapter 5",
                visitors: 0,
                percentageOfVisitors: 0,
                conversionFromPrevious: 0,
            },
            {
                id: "enrollment-open",
                label: "Opened Enrollment",
                visitors: 0,
                percentageOfVisitors: 0,
                conversionFromPrevious: 0,
            },
            {
                id: "checkout-click",
                label: "Clicked Checkout",
                visitors: 0,
                percentageOfVisitors: 0,
                conversionFromPrevious: 0,
            },
        ];
    }

    const allVisitors = new Set(
        rows
            .filter((row) => row.event_name === "page_view")
            .map((row) => row.visitor_id)
    );

    const chapterFiveVisitors = new Set(
        rows
            .filter(
                (row) =>
                    row.event_name === "chapter_view" &&
                    row.section_id === "chapter-5" &&
                    allVisitors.has(row.visitor_id)
            )
            .map((row) => row.visitor_id)
    );

    const enrollmentVisitors = new Set(
        rows
            .filter(
                (row) =>
                    row.event_name === "enrollment_open" &&
                    allVisitors.has(row.visitor_id)
            )
            .map((row) => row.visitor_id)
    );

    const checkoutVisitors = new Set(
        rows
            .filter(
                (row) =>
                    row.event_name === "checkout_click" &&
                    allVisitors.has(row.visitor_id)
            )
            .map((row) => row.visitor_id)
    );

    const stages = [
        {
            id: "visitors",
            label: "Visitors",
            visitors: allVisitors.size,
        },
        {
            id: "chapter-5",
            label: "Reached Chapter 5",
            visitors: chapterFiveVisitors.size,
        },
        {
            id: "enrollment-open",
            label: "Opened Enrollment",
            visitors: enrollmentVisitors.size,
        },
        {
            id: "checkout-click",
            label: "Clicked Checkout",
            visitors: checkoutVisitors.size,
        },
    ];

    return stages.map((stage, index) => {
        const previousStage = stages[index - 1];

        const percentageOfVisitors =
            allVisitors.size > 0
                ? Number(
                    ((stage.visitors / allVisitors.size) * 100).toFixed(1)
                )
                : 0;

        const conversionFromPrevious =
            index === 0
                ? null
                : previousStage.visitors > 0
                    ? Number(
                        (
                            (stage.visitors / previousStage.visitors) *
                            100
                        ).toFixed(1)
                    )
                    : 0;

        return {
            ...stage,
            percentageOfVisitors,
            conversionFromPrevious,
        };
    });
}
type SessionAnalyticsRow = {
    visitor_id: string;
    session_id: string;
    event_name: string;
    section_id: string | null;
    created_at: string;
    device_type: string | null;
};

function getChapterNumber(sectionId: string | null) {
    if (!sectionId) {
        return 0;
    }

    const match = sectionId.match(/^chapter-(\d+)$/);

    return match ? Number(match[1]) : 0;
}

function getChapterTitle(chapterNumber: number) {
    const chapter = FSE_CHAPTERS[chapterNumber - 1];

    return chapter?.title ?? "Beginning";
}

function formatSessionTime(dateValue: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(dateValue));
}

function formatDuration(seconds: number) {
    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
        return `${minutes}m`;
    }

    return `${minutes}m ${remainingSeconds}s`;
}

function formatDevice(device: string | null) {
    if (!device) {
        return "Unknown";
    }

    return device.charAt(0).toUpperCase() + device.slice(1).toLowerCase();
}

function createVisitorLabel(visitorId: string) {
    const shortId = visitorId.replaceAll("-", "").slice(0, 6).toUpperCase();

    return `Visitor ${shortId}`;
}

export async function getRecentSessions(
    limit = 20
): Promise<RecentSessionMetric[]> {
    const safeLimit = Math.max(1, Math.min(limit, 100));

    /*
     * We pull more rows than sessions because each session contains
     * multiple events.
     */
    const { data, error } = await supabaseAdmin
        .from("analytics_events")
        .select(
            "visitor_id, session_id, event_name, section_id, created_at, device_type"
        )
        .eq("site", "fse")
        .in("event_name", [
            "page_view",
            "chapter_view",
            "enrollment_open",
            "enrollment_close",
            "checkout_click",
        ])
        .order("created_at", { ascending: false })
        .limit(safeLimit * 30);

    if (error) {
        console.error("Unable to load recent sessions:", error);
        return [];
    }

    const rows = (data ?? []) as SessionAnalyticsRow[];

    const rowsBySession = new Map<string, SessionAnalyticsRow[]>();

    rows.forEach((row) => {
        const existingRows = rowsBySession.get(row.session_id) ?? [];

        existingRows.push(row);
        rowsBySession.set(row.session_id, existingRows);
    });

    const sessions = [...rowsBySession.entries()]
        .map(([sessionId, sessionRows]) => {
            const orderedRows = [...sessionRows].sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            );

            const firstEvent = orderedRows[0];
            const lastEvent = orderedRows[orderedRows.length - 1];

            if (!firstEvent || !lastEvent) {
                return null;
            }

            const deepestChapterNumber = orderedRows.reduce(
                (deepest, row) => {
                    if (row.event_name !== "chapter_view") {
                        return deepest;
                    }

                    return Math.max(
                        deepest,
                        getChapterNumber(row.section_id)
                    );
                },
                0
            );

            const deepestChapterId =
                deepestChapterNumber > 0
                    ? `chapter-${deepestChapterNumber}`
                    : null;

            const durationSeconds = Math.max(
                0,
                Math.round(
                    (new Date(lastEvent.created_at).getTime() -
                        new Date(firstEvent.created_at).getTime()) /
                    1000
                )
            );

            const sessionStartedAt = new Date(
                firstEvent.created_at
            ).getTime();

            const events: SessionJourneyEvent[] = orderedRows.map(
                (row, index) => {
                    const occurredAt = new Date(row.created_at).getTime();

                    const elapsedSeconds = Math.max(
                        0,
                        Math.round(
                            (occurredAt - sessionStartedAt) / 1000
                        )
                    );

                    return {
                        id: `${sessionId}-${index}-${row.event_name}`,
                        eventName: row.event_name,
                        label: getJourneyEventLabel(
                            row.event_name,
                            row.section_id
                        ),
                        sectionId: row.section_id,
                        occurredAt: row.created_at,
                        occurredAtLabel: formatJourneyTime(
                            row.created_at
                        ),
                        elapsedSeconds,
                        elapsedLabel:
                            elapsedSeconds === 0
                                ? "Arrival"
                                : `+${formatDuration(elapsedSeconds)}`,
                    };
                }
            );

            const hasCheckoutClick = orderedRows.some(
                (row) => row.event_name === "checkout_click"
            );

            const hasEnrollmentOpen = orderedRows.some(
                (row) => row.event_name === "enrollment_open"
            );

            const outcome: RecentSessionMetric["outcome"] =
                hasCheckoutClick
                    ? "checkout"
                    : hasEnrollmentOpen
                        ? "enrollment"
                        : "left";

            const device =
                orderedRows.find((row) => row.device_type)?.device_type ?? null;

            return {
                sessionId,
                visitorId: firstEvent.visitor_id,
                visitorLabel: createVisitorLabel(firstEvent.visitor_id),
                startedAt: firstEvent.created_at,
                startedAtLabel: formatSessionTime(firstEvent.created_at),
                device: formatDevice(device),
                deepestChapterId,
                deepestChapterTitle:
                    deepestChapterNumber > 0
                        ? getChapterTitle(deepestChapterNumber)
                        : "Beginning",
                deepestChapterNumber,
                durationSeconds,
                durationLabel: formatDuration(durationSeconds),
                outcome,
                events,
            };
        })
        .filter(
            (session): session is RecentSessionMetric => session !== null
        )
        .sort(
            (a, b) =>
                new Date(b.startedAt).getTime() -
                new Date(a.startedAt).getTime()
        );

    return sessions.slice(0, safeLimit);
}

function formatJourneyTime(dateValue: string) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    }).format(new Date(dateValue));
}

function getJourneyEventLabel(
    eventName: string,
    sectionId: string | null
) {
    if (eventName === "page_view") {
        return "Arrived";
    }

    if (eventName === "chapter_view") {
        const chapterNumber = getChapterNumber(sectionId);

        return chapterNumber > 0
            ? `Reached Chapter ${chapterNumber}`
            : "Continued through the page";
    }

    if (eventName === "enrollment_open") {
        return "Opened enrollment";
    }

    if (eventName === "enrollment_close") {
        return "Closed enrollment";
    }

    if (eventName === "checkout_click") {
        return "Clicked checkout";
    }

    return eventName.replaceAll("_", " ");
}