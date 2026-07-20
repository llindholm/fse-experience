type StatCardProps = {
    label: string;
    value: string | number;
    detail?: string;
};

export default function StatCard({
    label,
    value,
    detail,
}: StatCardProps) {
    return (
        <article className="dashboard-stat-card">
            <p className="dashboard-stat-label">{label}</p>

            <p className="dashboard-stat-value">{value}</p>

            {detail && <p className="dashboard-stat-detail">{detail}</p>}
        </article>
    );
}