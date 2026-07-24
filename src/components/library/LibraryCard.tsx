type LibraryCardProps = {
    eyebrow: string;
    title: string;
    description: string;
    href?: string;
    progress?: number;
    featured?: boolean;
};

export default function LibraryCard({
    eyebrow,
    title,
    description,
    href = "#",
    progress,
    featured = false,
}: LibraryCardProps) {
    const safeProgress =
        typeof progress === "number"
            ? Math.max(0, Math.min(progress, 100))
            : null;

    return (
        <a
            className={`library-card ${featured ? "library-card--featured" : ""
                }`}
            href={href}
        >
            <div className="library-card__content">
                <span className="library-card__eyebrow">
                    {eyebrow}
                </span>

                <h2 className="library-card__title">
                    {title}
                </h2>

                <p className="library-card__description">
                    {description}
                </p>

                <span className="library-card__link">
                    Enter
                    <span aria-hidden="true">→</span>
                </span>
            </div>

            {safeProgress !== null && (
                <div className="library-card__progress">
                    <div className="library-card__progress-label">
                        <span>Your progress</span>
                        <span>{safeProgress}%</span>
                    </div>

                    <div
                        className="library-card__progress-track"
                        aria-label={`${safeProgress}% complete`}
                    >
                        <span
                            className="library-card__progress-value"
                            style={{ width: `${safeProgress}%` }}
                        />
                    </div>
                </div>
            )}
        </a>
    );
}