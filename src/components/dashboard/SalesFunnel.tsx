import type { FunnelStageMetric } from "@/lib/dashboard/analytics";

type SalesFunnelProps = {
    stages: FunnelStageMetric[];
};

export default function SalesFunnel({
    stages,
}: SalesFunnelProps) {
    const firstStageVisitors = stages[0]?.visitors ?? 0;

    return (
        <section className="dashboard-panel">
            <div className="dashboard-panel-heading">
                <div>
                    <p className="dashboard-panel-eyebrow">
                        Conversion
                    </p>

                    <h2>Sales funnel</h2>
                </div>

                <p className="dashboard-panel-note">
                    How visitors move from arrival to checkout intent
                </p>
            </div>

            <div className="sales-funnel">
                {stages.map((stage, index) => {
                    const width =
                        firstStageVisitors > 0
                            ? Math.max(
                                16,
                                (stage.visitors /
                                    firstStageVisitors) *
                                100
                            )
                            : 16;

                    return (
                        <div
                            className="sales-funnel-stage"
                            key={stage.id}
                        >
                            {index > 0 && (
                                <div className="sales-funnel-conversion">
                                    <span aria-hidden="true">↓</span>

                                    <p>
                                        {stage.conversionFromPrevious}%
                                        <small>
                                            from previous stage
                                        </small>
                                    </p>
                                </div>
                            )}

                            <div className="sales-funnel-stage-heading">
                                <div>
                                    <span>
                                        {String(index + 1).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>

                                    <p>{stage.label}</p>
                                </div>

                                <div className="sales-funnel-stage-result">
                                    <strong>{stage.visitors}</strong>

                                    <span>
                                        {stage.percentageOfVisitors}%
                                        of visitors
                                    </span>
                                </div>
                            </div>

                            <div className="sales-funnel-track">
                                <span
                                    className="sales-funnel-fill"
                                    style={{
                                        width: `${width}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}