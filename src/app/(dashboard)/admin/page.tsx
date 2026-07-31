import ChapterProgress from "@/components/admin/ChapterProgress";
import StatCard from "@/components/admin/StatCard";
import VisitorTrend from "@/components/admin/VisitorTrend";
import SalesFunnel from "@/components/admin/SalesFunnel";
import IntelligenceBrief from "@/components/admin/IntelligenceBrief";
import SessionExplorer from "@/components/admin/SessionExplorer";
import AnalyticsRangeFilter, {
    type AnalyticsRangeKey,
} from "@/components/admin/AnalyticsRangeFilter";

import {
    getChapterProgression,
    getDailyVisitorTrend,
    getOverviewMetrics,
    getSalesFunnel,
    getRecentSessions,
    type AnalyticsDateRange,
} from "@/lib/admin/analytics";

import {
    buildIntelligenceBrief,
} from "@/lib/admin/intelligence";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminPageProps = {
    searchParams: Promise<{
        range?: string;
    }>;
}

function getRangeKey(
    value: string | undefined
): AnalyticsRangeKey {
    if (
        value === "yesterday-today" ||
        value === "7" ||
        value === "30" ||
        value === "90" ||
        value === "all"
    ) {
        return value;
    }

    return "30";
}

function buildDateRange(
    rangeKey: AnalyticsRangeKey
): AnalyticsDateRange {
    if (rangeKey === "all") {
        return {};
    }

    const startDate = new Date();

    startDate.setUTCHours(0, 0, 0, 0);

    if (rangeKey === "yesterday-today") {
        startDate.setUTCDate(
            startDate.getUTCDate() - 1
        );

        return {
            startDate: startDate.toISOString(),
        };
    }

    const numberOfDays = Number(rangeKey);

    startDate.setUTCDate(
        startDate.getUTCDate() -
        (numberOfDays - 1)
    );

    return {
        startDate: startDate.toISOString(),
    };
}


export default async function AdminPage({
    searchParams,
}: AdminPageProps) {


    const { range } = await searchParams;

    const rangeKey = getRangeKey(range);
    const dateRange = buildDateRange(rangeKey);

    const [
        overview,
        chapters,
        visitorTrend,
        salesFunnel,
        recentSessions,
    ] = await Promise.all([
        getOverviewMetrics(dateRange),
        getChapterProgression(dateRange),
        getDailyVisitorTrend(dateRange),
        getSalesFunnel(dateRange),
        getRecentSessions(
            20,
            dateRange
        ),
    ]);

    const intelligenceBrief = buildIntelligenceBrief({
        overview,
        chapters,
        visitorTrend,
        salesFunnel,
    });


    return (
        <div className="dashboard-page">
            <section className="dashboard-intro">
                <div>
                    <p className="dashboard-section-label">Overview</p>

                    <h1>
                        Your sales experience,
                        <span>understood.</span>
                    </h1>
                </div>

                <p className="dashboard-intro-copy">
                    A living view of how visitors move through Feminine Sales Engine,
                    where attention deepens, and when curiosity turns into action.
                </p>
            </section>

            <section className="dashboard-range-section">
                <div>
                    <p className="dashboard-section-label">
                        Reporting period
                    </p>

                    <p className="dashboard-range-copy">
                        All metrics below reflect the selected
                        date range.
                    </p>
                </div>

                <AnalyticsRangeFilter
                    currentRange={rangeKey}
                />
            </section>

            <IntelligenceBrief brief={intelligenceBrief} />

            <section className="dashboard-stat-grid">
                <StatCard
                    label="Visitors"
                    value={overview.visitors}
                    detail="Unique people"
                />

                <StatCard
                    label="Sessions"
                    value={overview.sessions}
                    detail="Page experiences"
                />

                <StatCard
                    label="Average scroll"
                    value={`${overview.averageScroll}%`}
                    detail="Depth reached"
                />

                <StatCard
                    label="Enrollment opens"
                    value={overview.enrollmentOpens}
                    detail="Unique sessions"
                />

                <StatCard
                    label="Checkout clicks"
                    value={overview.checkoutClicks}
                    detail="Unique sessions"
                />

                <StatCard
                    label="Click conversion"
                    value={`${overview.clickConversion}%`}
                    detail="Visitors to checkout"
                />
            </section>

            <VisitorTrend data={visitorTrend} />

            <SalesFunnel stages={salesFunnel} />

            <ChapterProgress chapters={chapters} />

            <SessionExplorer sessions={recentSessions} />
        </div>
    );
}