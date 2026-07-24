type Chapter = {
    id: string;
    title: string;
    percentage: number;
    visitors?: number;
};

type ChapterProgressProps = {
    chapters: Chapter[];
};

export default function ChapterProgress({
    chapters,
}: ChapterProgressProps) {
    return (
        <section className="dashboard-panel">
            <div className="dashboard-panel-heading">
                <div>
                    <p className="dashboard-panel-eyebrow">Reader journey</p>
                    <h2>Chapter progression</h2>
                </div>

                <p className="dashboard-panel-note">
                    Percentage of visitors who reached each chapter
                </p>
            </div>

            <div className="chapter-progress-list">
                {chapters.map((chapter, index) => (
                    <div className="chapter-progress-item" key={chapter.id}>
                        <div className="chapter-progress-heading">
                            <div>
                                <span className="chapter-progress-number">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="chapter-progress-title">
                                    {chapter.title}
                                </span>
                            </div>

                            <div className="chapter-progress-result">
                                {typeof chapter.visitors === "number" && (
                                    <span>
                                        {chapter.visitors}{" "}
                                        {chapter.visitors === 1 ? "visitor" : "visitors"}
                                    </span>
                                )}

                                <strong>{chapter.percentage}%</strong>
                            </div>
                        </div>

                        <div
                            className="chapter-progress-track"
                            aria-label={`${chapter.title}: ${chapter.percentage}%`}
                        >
                            <span
                                className="chapter-progress-fill"
                                style={{ width: `${chapter.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}