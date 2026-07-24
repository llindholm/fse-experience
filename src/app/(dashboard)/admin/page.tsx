import ChapterProgress from "@/components/admin/ChapterProgress";
import StatCard from "@/components/admin/StatCard";
import {
    getChapterProgression,
    getDailyVisitorTrend,
    getOverviewMetrics,
    getSalesFunnel,
    getRecentSessions,
} from "@/lib/admin/analytics";
import VisitorTrend from "@/components/admin/VisitorTrend";
import SalesFunnel from "@/components/admin/SalesFunnel";
import IntelligenceBrief from "@/components/admin/IntelligenceBrief";
import { buildIntelligenceBrief } from "@/lib/admin/intelligence";
import SessionExplorer from "@/components/admin/SessionExplorer";
import SignOutButton from "@/components/admin/SignOutButton";


export default async function AdminPage() {
    const [
        overview,
        chapters,
        visitorTrend,
        salesFunnel,
        recentSessions,
    ] = await Promise.all([
        getOverviewMetrics(),
        getChapterProgression(),
        getDailyVisitorTrend(30),
        getSalesFunnel(),
        getRecentSessions(20),
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