import Link from "next/link";

import "./acquisition.css";

type QueueItem = {
    title: string;
    format: string;
    theme: string;
    status: "Ready next" | "Drafting";
};

type RecentAsset = {
    title: string;
    format: string;
    publishedAt: string;
    theme: string;
    reach: number | null;
    profileVisits: number | null;
    pageVisitors: number | null;
    learning: string;
};

const queueItems: QueueItem[] = [
    {
        title: "Authority is not attention",
        format: "Carousel",
        theme: "Authority vs visibility",
        status: "Ready next",
    },
    {
        title: "Your business should remember how to sell without you",
        format: "Reel",
        theme: "Architecture over effort",
        status: "Ready next",
    },
    {
        title: "Evergreen does not have to feel impersonal",
        format: "Carousel",
        theme: "Quiet conversion",
        status: "Drafting",
    },
];

const recentAssets: RecentAsset[] = [
    {
        title: "Maybe you are not inconsistent",
        format: "Carousel",
        publishedAt: "Not published",
        theme: "The myth of consistency",
        reach: null,
        profileVisits: null,
        pageVisitors: null,
        learning:
            "Seed asset. Performance will appear after publication.",
    },
    {
        title: "The business only works when you do",
        format: "Carousel",
        publishedAt: "Not published",
        theme: "The invisible ceiling",
        reach: null,
        profileVisits: null,
        pageVisitors: null,
        learning:
            "Designed to test identity recognition before tactical education.",
    },
];

export default function AcquisitionPage() {
    const today = new Intl.DateTimeFormat(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
        }
    ).format(new Date());

    return (
        <main className="acquisition-page">
            <header className="acquisition-header">
                <div>
                    <p className="acquisition-eyebrow">
                        Acquisition Lab
                    </p>

                    <h1>
                        Today&apos;s
                        <span> marketing brief.</span>
                    </h1>

                    <p className="acquisition-date">
                        {today}
                    </p>
                </div>

                <div className="acquisition-objective">
                    <p className="acquisition-card-label">
                        Active objective
                    </p>

                    <strong>
                        Grow qualified organic traffic
                        to FSE
                    </strong>

                    <span>
                        New Instagram discovery account
                    </span>
                </div>
            </header>

            <section className="acquisition-brief-grid">
                <article className="acquisition-card acquisition-results-card">
                    <div className="acquisition-card-heading">
                        <div>
                            <p className="acquisition-card-label">
                                Yesterday
                            </p>

                            <h2>
                                Performance snapshot
                            </h2>
                        </div>

                        <span className="acquisition-status acquisition-status--quiet">
                            Awaiting data
                        </span>
                    </div>

                    <div className="acquisition-metric-groups">
                        <div className="acquisition-metric-group">
                            <p>
                                Instagram
                            </p>

                            <dl>
                                <div>
                                    <dt>Reach</dt>
                                    <dd>—</dd>
                                </div>

                                <div>
                                    <dt>Profile visits</dt>
                                    <dd>—</dd>
                                </div>

                                <div>
                                    <dt>Link taps</dt>
                                    <dd>—</dd>
                                </div>

                                <div>
                                    <dt>New followers</dt>
                                    <dd>—</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="acquisition-metric-group">
                            <p>
                                FSE from Instagram
                            </p>

                            <dl>
                                <div>
                                    <dt>Visitors</dt>
                                    <dd>—</dd>
                                </div>

                                <div>
                                    <dt>Average scroll</dt>
                                    <dd>—</dd>
                                </div>

                                <div>
                                    <dt>Chapter 5+</dt>
                                    <dd>—</dd>
                                </div>

                                <div>
                                    <dt>Checkout clicks</dt>
                                    <dd>—</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="acquisition-learning">
                        <p className="acquisition-card-label">
                            What we learned
                        </p>

                        <p>
                            The account has not begun publishing
                            yet, so there is no performance signal
                            to interpret. The first six posts will
                            establish a clean baseline for reach,
                            profile interest, and qualified FSE
                            traffic.
                        </p>
                    </div>
                </article>

                <article className="acquisition-card acquisition-assignment-card">
                    <div className="acquisition-card-heading">
                        <div>
                            <p className="acquisition-card-label">
                                Today&apos;s assignment
                            </p>

                            <h2>
                                Create an Instagram carousel
                            </h2>
                        </div>

                        <span className="acquisition-status acquisition-status--active">
                            Recommended
                        </span>
                    </div>

                    <div className="acquisition-assignment-theme">
                        <p className="acquisition-card-label">
                            Discovery theme
                        </p>

                        <h3>
                            The myth of consistency
                        </h3>
                    </div>

                    <blockquote>
                        Maybe you are not inconsistent.
                        Maybe your business only knows
                        how to work when you do.
                    </blockquote>

                    <div className="acquisition-belief-grid">
                        <div>
                            <p className="acquisition-card-label">
                                Current belief
                            </p>

                            <p>
                                “I need to become more
                                disciplined.”
                            </p>
                        </div>

                        <div>
                            <p className="acquisition-card-label">
                                Desired belief
                            </p>

                            <p>
                                “My business needs a structure
                                that does not depend on my daily
                                energy.”
                            </p>
                        </div>
                    </div>

                    <div className="acquisition-assignment-details">
                        <div>
                            <p className="acquisition-card-label">
                                Purpose
                            </p>

                            <p>
                                Attract established women whose
                                sales slow down whenever they stop
                                actively marketing.
                            </p>
                        </div>

                        <div>
                            <p className="acquisition-card-label">
                                Sales-page connection
                            </p>

                            <p>
                                Prepares readers for Chapters 1–3
                                of the FSE experience.
                            </p>
                        </div>

                        <div>
                            <p className="acquisition-card-label">
                                Estimated time
                            </p>

                            <p>
                                30 minutes
                            </p>
                        </div>
                    </div>

                    <div className="acquisition-assignment-actions">
                        <Link
                            href="/admin/acquisition/create"
                            className="acquisition-primary-action"
                        >
                            Create today&apos;s asset
                            <span aria-hidden="true">
                                →
                            </span>
                        </Link>

                        <button
                            type="button"
                            className="acquisition-secondary-action"
                        >
                            Try another angle
                        </button>
                    </div>
                </article>
            </section>

            <section className="acquisition-card acquisition-experiment-card">
                <div className="acquisition-card-heading">
                    <div>
                        <p className="acquisition-card-label">
                            Current experiment
                        </p>

                        <h2>
                            Identity-first versus
                            educational carousels
                        </h2>
                    </div>

                    <span className="acquisition-status acquisition-status--quiet">
                        Setup
                    </span>
                </div>

                <div className="acquisition-experiment-grid">
                    <div>
                        <p className="acquisition-card-label">
                            Question
                        </p>

                        <p>
                            Do identity-first carousels create
                            more qualified FSE readers than
                            educational carousels?
                        </p>
                    </div>

                    <div>
                        <p className="acquisition-card-label">
                            Hypothesis
                        </p>

                        <p>
                            Recognition-led posts will create
                            more profile visits and deeper
                            sales-page progression than tactical
                            advice.
                        </p>
                    </div>

                    <div>
                        <p className="acquisition-card-label">
                            Primary platform signal
                        </p>

                        <p>
                            Profile visits per 100
                            non-follower accounts reached.
                        </p>
                    </div>

                    <div>
                        <p className="acquisition-card-label">
                            Primary business signal
                        </p>

                        <p>
                            Percentage of Instagram visitors
                            reaching Chapter 5 or later.
                        </p>
                    </div>
                </div>

                <div className="acquisition-experiment-progress">
                    <div className="acquisition-progress-copy">
                        <span>
                            0 of 6 posts published
                        </span>

                        <span>
                            Too early to conclude
                        </span>
                    </div>

                    <div
                        className="acquisition-progress-track"
                        aria-label="Experiment progress"
                    >
                        <span style={{ width: "0%" }} />
                    </div>
                </div>
            </section>

            <section className="acquisition-lower-grid">
                <article className="acquisition-card">
                    <div className="acquisition-card-heading">
                        <div>
                            <p className="acquisition-card-label">
                                Content queue
                            </p>

                            <h2>
                                What comes next
                            </h2>
                        </div>
                    </div>

                    <div className="acquisition-queue">
                        {queueItems.map((item) => (
                            <div
                                key={item.title}
                                className="acquisition-queue-item"
                            >
                                <div>
                                    <span>
                                        {item.status}
                                    </span>

                                    <h3>
                                        {item.title}
                                    </h3>

                                    <p>
                                        {item.format} ·{" "}
                                        {item.theme}
                                    </p>
                                </div>

                                <span
                                    className="acquisition-queue-arrow"
                                    aria-hidden="true"
                                >
                                    →
                                </span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="acquisition-card">
                    <div className="acquisition-card-heading">
                        <div>
                            <p className="acquisition-card-label">
                                Marketing memory
                            </p>

                            <h2>
                                What the Lab believes
                            </h2>
                        </div>
                    </div>

                    <div className="acquisition-memory-item">
                        <span className="acquisition-status acquisition-status--quiet">
                            No evidence yet
                        </span>

                        <h3>
                            Identity-first hooks create more
                            qualified curiosity.
                        </h3>

                        <p>
                            This is the first hypothesis being
                            tested. It should not become a
                            permanent conclusion until the
                            account has produced enough reach
                            and downstream visitor behavior.
                        </p>

                        <div className="acquisition-memory-meta">
                            <span>
                                Evidence: 0 posts
                            </span>

                            <span>
                                Confidence: None
                            </span>
                        </div>
                    </div>
                </article>
            </section>

            <section className="acquisition-recent-section">
                <div className="acquisition-section-heading">
                    <div>
                        <p className="acquisition-card-label">
                            Recent assets
                        </p>

                        <h2>
                            Experiment records
                        </h2>
                    </div>

                    <p>
                        Each published post will eventually
                        connect Instagram performance with
                        sales-page behavior.
                    </p>
                </div>

                <div className="acquisition-recent-grid">
                    {recentAssets.map((asset) => (
                        <article
                            key={asset.title}
                            className="acquisition-recent-card"
                        >
                            <div className="acquisition-recent-topline">
                                <span>
                                    {asset.format}
                                </span>

                                <span>
                                    {asset.publishedAt}
                                </span>
                            </div>

                            <h3>
                                {asset.title}
                            </h3>

                            <p className="acquisition-recent-theme">
                                {asset.theme}
                            </p>

                            <dl>
                                <div>
                                    <dt>Reach</dt>
                                    <dd>
                                        {asset.reach ?? "—"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Profile visits</dt>
                                    <dd>
                                        {
                                            asset.profileVisits ??
                                            "—"
                                        }
                                    </dd>
                                </div>

                                <div>
                                    <dt>FSE visitors</dt>
                                    <dd>
                                        {
                                            asset.pageVisitors ??
                                            "—"
                                        }
                                    </dd>
                                </div>
                            </dl>

                            <div className="acquisition-recent-learning">
                                <span>
                                    Current learning
                                </span>

                                <p>
                                    {asset.learning}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}