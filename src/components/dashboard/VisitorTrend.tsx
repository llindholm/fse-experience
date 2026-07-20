import type { DailyVisitorMetric } from "@/lib/dashboard/analytics";

type VisitorTrendProps = {
    data: DailyVisitorMetric[];
};

function buildLinePath(values: number[], width: number, height: number) {
    if (values.length === 0) return "";

    const maximum = Math.max(...values, 1);
    const horizontalStep =
        values.length > 1 ? width / (values.length - 1) : 0;

    return values
        .map((value, index) => {
            const x = index * horizontalStep;
            const y = height - (value / maximum) * height;

            return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");
}

export default function VisitorTrend({ data }: VisitorTrendProps) {
    const chartWidth = 1000;
    const chartHeight = 260;

    const visitorValues = data.map((day) => day.visitors);
    const path = buildLinePath(visitorValues, chartWidth, chartHeight);

    const totalVisitors = visitorValues.reduce(
        (total, value) => total + value,
        0
    );

    const peakVisitors = Math.max(...visitorValues, 0);

    const peakDay =
        data.find((day) => day.visitors === peakVisitors)?.label ?? "—";

    const visibleLabels = data.filter(
        (_, index) =>
            index === 0 ||
            index === data.length - 1 ||
            index % 5 === 0
    );

    return (
        <section className="dashboard-panel visitor-trend-panel">
            <div className="dashboard-panel-heading">
                <div>
                    <p className="dashboard-panel-eyebrow">Traffic</p>
                    <h2>Visitor trend</h2>
                </div>

                <p className="dashboard-panel-note">
                    Unique visitors during the last 30 days
                </p>
            </div>

            <div className="visitor-trend-summary">
                <div>
                    <span>Total visitors</span>
                    <strong>{totalVisitors}</strong>
                </div>

                <div>
                    <span>Highest day</span>
                    <strong>{peakVisitors}</strong>
                    <small>{peakDay}</small>
                </div>
            </div>

            <div className="visitor-trend-chart">
                <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    role="img"
                    aria-label="Unique visitors over the last 30 days"
                    preserveAspectRatio="none"
                >
                    <line
                        className="visitor-trend-grid-line"
                        x1="0"
                        y1={chartHeight}
                        x2={chartWidth}
                        y2={chartHeight}
                    />

                    <line
                        className="visitor-trend-grid-line"
                        x1="0"
                        y1={chartHeight / 2}
                        x2={chartWidth}
                        y2={chartHeight / 2}
                    />

                    <path
                        className="visitor-trend-line"
                        d={path}
                        vectorEffect="non-scaling-stroke"
                    />

                    {data.map((day, index) => {
                        const maximum = Math.max(...visitorValues, 1);
                        const x =
                            data.length > 1
                                ? (index / (data.length - 1)) * chartWidth
                                : 0;
                        const y =
                            chartHeight -
                            (day.visitors / maximum) * chartHeight;

                        return (
                            <circle
                                key={day.date}
                                className="visitor-trend-point"
                                cx={x}
                                cy={y}
                                r="5"
                                vectorEffect="non-scaling-stroke"
                                role="img"
                                aria-label={`${day.label}: ${day.visitors} ${day.visitors === 1 ? "visitor" : "visitors"
                                    }`}
                            />
                        );
                    })}
                </svg>

                <div className="visitor-trend-labels">
                    {visibleLabels.map((day) => (
                        <span key={day.date}>{day.label}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}