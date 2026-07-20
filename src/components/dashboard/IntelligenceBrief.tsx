import type { IntelligenceBrief as IntelligenceBriefData } from "@/lib/dashboard/intelligence";

type IntelligenceBriefProps = {
    brief: IntelligenceBriefData;
};

export default function IntelligenceBrief({
    brief,
}: IntelligenceBriefProps) {
    return (
        <section
            className={`intelligence-brief intelligence-brief--${brief.status}`}
        >
            <div className="intelligence-brief-heading">
                <div>
                    <p className="dashboard-panel-eyebrow">
                        Intelligence brief
                    </p>

                    <h2>{brief.greeting}</h2>
                </div>

                <span className="intelligence-brief-status">
                    {brief.status}
                </span>
            </div>

            <div className="intelligence-brief-body">
                <p className="intelligence-brief-summary">
                    {brief.summary}
                </p>

                <div className="intelligence-brief-findings">
                    <div>
                        <span>What we see</span>
                        <p>{brief.observation}</p>
                    </div>

                    <div>
                        <span>What to do next</span>
                        <p>{brief.recommendation}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}