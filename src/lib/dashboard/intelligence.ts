import type {
    ChapterProgressMetric,
    DailyVisitorMetric,
    FunnelStageMetric,
    OverviewMetrics,
} from "@/lib/dashboard/analytics";

export type IntelligenceBrief = {
    greeting: string;
    summary: string;
    observation: string;
    recommendation: string;
    status: "quiet" | "steady" | "growing" | "attention";
};

type BuildIntelligenceBriefArgs = {
    overview: OverviewMetrics;
    chapters: ChapterProgressMetric[];
    visitorTrend: DailyVisitorMetric[];
    salesFunnel: FunnelStageMetric[];
};

function sumVisitors(days: DailyVisitorMetric[]) {
    return days.reduce((total, day) => total + day.visitors, 0);
}

function formatPercent(value: number) {
    return `${Math.abs(Number(value.toFixed(1)))}%`;
}

export function buildIntelligenceBrief({
    overview,
    chapters,
    visitorTrend,
    salesFunnel,
}: BuildIntelligenceBriefArgs): IntelligenceBrief {
    if (overview.visitors === 0) {
        return {
            greeting: "The system is ready.",
            summary:
                "There is not enough visitor activity yet to interpret the sales experience.",
            observation:
                "Once traffic begins arriving, this brief will identify movement through the story, enrollment interest, and checkout intent.",
            recommendation:
                "No action is needed yet. Let the first meaningful traffic sample arrive before changing the page.",
            status: "quiet",
        };
    }

    /*
     * Compare the most recent seven days with the seven days before them.
     */
    const recentSevenDays = visitorTrend.slice(-7);
    const previousSevenDays = visitorTrend.slice(-14, -7);

    const recentVisitors = sumVisitors(recentSevenDays);
    const previousVisitors = sumVisitors(previousSevenDays);

    const trafficChange =
        previousVisitors > 0
            ? ((recentVisitors - previousVisitors) / previousVisitors) * 100
            : recentVisitors > 0
                ? 100
                : 0;

    let trafficSentence: string;
    let status: IntelligenceBrief["status"] = "steady";

    if (trafficChange >= 15) {
        trafficSentence = `Traffic increased ${formatPercent(
            trafficChange
        )} compared with the previous seven days.`;
        status = "growing";
    } else if (trafficChange <= -15) {
        trafficSentence = `Traffic declined ${formatPercent(
            trafficChange
        )} compared with the previous seven days.`;
        status = "attention";
    } else {
        trafficSentence =
            "Traffic has remained relatively steady over the last seven days.";
    }

    /*
     * Find the largest conversion loss between consecutive funnel stages.
     */
    const funnelTransitions = salesFunnel
        .slice(1)
        .map((stage, index) => {
            const previousStage = salesFunnel[index];

            const conversion = stage.conversionFromPrevious ?? 0;

            return {
                from: previousStage?.label ?? "Previous stage",
                to: stage.label,
                conversion,
                dropOff: 100 - conversion,
            };
        });

    const largestDrop = funnelTransitions.reduce<
        (typeof funnelTransitions)[number] | null
    >((largest, transition) => {
        if (!largest || transition.dropOff > largest.dropOff) {
            return transition;
        }

        return largest;
    }, null);

    /*
     * Find the steepest chapter-to-chapter audience decline.
     */
    const chapterDrops = chapters.slice(1).map((chapter, index) => {
        const previousChapter = chapters[index];

        return {
            from: previousChapter,
            to: chapter,
            drop:
                (previousChapter?.percentage ?? 0) -
                chapter.percentage,
        };
    });

    const largestChapterDrop = chapterDrops.reduce<
        (typeof chapterDrops)[number] | null
    >((largest, transition) => {
        if (!largest || transition.drop > largest.drop) {
            return transition;
        }

        return largest;
    }, null);

    const summary = `${trafficSentence} ${overview.visitors} unique ${overview.visitors === 1 ? "visitor has" : "visitors have"
        } generated ${overview.sessions} ${overview.sessions === 1 ? "session" : "sessions"
        }, with an average scroll depth of ${overview.averageScroll}%.`;

    let observation =
        "Visitors are moving through the experience without a clearly dominant point of resistance yet.";

    if (
        largestDrop &&
        largestDrop.dropOff >= 20 &&
        largestDrop.from &&
        largestDrop.to
    ) {
        observation = `The largest funnel loss currently occurs between “${largestDrop.from}” and “${largestDrop.to},” where ${formatPercent(
            largestDrop.dropOff
        )} of visitors do not continue to the next stage.`;
    } else if (
        largestChapterDrop &&
        largestChapterDrop.drop >= 10 &&
        largestChapterDrop.from
    ) {
        observation = `The sharpest narrative decline appears between ${largestChapterDrop.from.title} and ${largestChapterDrop.to.title}, a drop of ${largestChapterDrop.drop} percentage points.`;
    }

    let recommendation =
        "Continue collecting data before making a major structural change.";

    if (overview.visitors < 25) {
        recommendation =
            "The current sample is still small. Avoid changing the page based on individual sessions; wait until at least 25–50 unique visitors have moved through it.";
    } else if (
        largestDrop?.to === "Opened Enrollment" &&
        largestDrop.dropOff >= 35
    ) {
        recommendation =
            "Review the transition into the enrollment invitation. The earlier story is holding attention, but too few visitors are choosing to explore the offer.";
        status = "attention";
    } else if (
        largestDrop?.to === "Clicked Checkout" &&
        largestDrop.dropOff >= 35
    ) {
        recommendation =
            "Review the enrollment section before changing the earlier narrative. Visitors are expressing interest, but that interest is not converting into checkout intent.";
        status = "attention";
    } else if (
        largestChapterDrop &&
        largestChapterDrop.drop >= 20
    ) {
        recommendation = `Review the bridge into “${largestChapterDrop.to.title}.” That transition currently represents the clearest opportunity to improve story retention.`;
        status = "attention";
    } else if (trafficChange >= 15) {
        recommendation =
            "Traffic is growing without a major conversion warning. Preserve the current experience and watch whether checkout intent rises with the larger sample.";
    }

    return {
        greeting: "Here’s what the experience is telling us.",
        summary,
        observation,
        recommendation,
        status,
    };
}