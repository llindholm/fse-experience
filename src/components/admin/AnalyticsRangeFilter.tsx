import Link from "next/link";

export type AnalyticsRangeKey =
    | "yesterday-today"
    | "7"
    | "30"
    | "90"
    | "all";

type AnalyticsRangeFilterProps = {
    currentRange: AnalyticsRangeKey;
};

const RANGE_OPTIONS: {
    value: AnalyticsRangeKey;
    label: string;
}[] = [
        {
            value: "yesterday-today",
            label: "Yesterday + today",
        },
        {
            value: "7",
            label: "7 days",
        },
        {
            value: "30",
            label: "30 days",
        },
        {
            value: "90",
            label: "90 days",
        },
        {
            value: "all",
            label: "All time",
        },
    ];

export default function AnalyticsRangeFilter({
    currentRange,
}: AnalyticsRangeFilterProps) {
    return (
        <nav
            className="analytics-range-filter"
            aria-label="Analytics date range"
        >
            {RANGE_OPTIONS.map((option) => (
                <Link
                    key={option.value}
                    href={`/admin?range=${option.value}`}
                    className={
                        currentRange === option.value
                            ? "is-active"
                            : undefined
                    }
                    aria-current={
                        currentRange === option.value
                            ? "page"
                            : undefined
                    }
                >
                    {option.label}
                </Link>
            ))}
        </nav>
    );
}