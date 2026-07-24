"use client";

import { useEffect, useState } from "react";

import type {
    RecentSessionMetric,
    SessionJourneyEvent,
} from "@/lib/admin/analytics";

type SessionExplorerProps = {
    sessions: RecentSessionMetric[];
};

function getOutcomeLabel(
    outcome: RecentSessionMetric["outcome"]
) {
    switch (outcome) {
        case "checkout":
            return "Checkout";
        case "enrollment":
            return "Enrollment";
        default:
            return "Left";
    }
}

function getJourneyEventClass(
    event: SessionJourneyEvent
) {
    if (event.eventName === "checkout_click") {
        return "checkout";
    }

    if (event.eventName === "enrollment_open") {
        return "enrollment";
    }

    if (event.eventName === "chapter_view") {
        return "chapter";
    }

    return "standard";
}

export default function SessionExplorer({
    sessions,
}: SessionExplorerProps) {
    const [selectedSession, setSelectedSession] =
        useState<RecentSessionMetric | null>(null);

    useEffect(() => {
        if (!selectedSession) {
            return;
        }

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setSelectedSession(null);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [selectedSession]);

    return (
        <>
            <section className="dashboard-panel session-explorer-panel">
                <div className="dashboard-panel-heading">
                    <div>
                        <p className="dashboard-panel-eyebrow">
                            Session explorer
                        </p>

                        <h2>Recent journeys</h2>
                    </div>

                    <p className="dashboard-panel-note">
                        Select a visitor to see their complete
                        journey through the experience.
                    </p>
                </div>

                {sessions.length === 0 ? (
                    <div className="session-explorer-empty">
                        <p>
                            No visitor sessions have been
                            recorded yet.
                        </p>
                    </div>
                ) : (
                    <div className="session-explorer-table">
                        <div className="session-explorer-header">
                            <span>Arrived</span>
                            <span>Visitor</span>
                            <span>Device</span>
                            <span>Progress</span>
                            <span>Duration</span>
                            <span>Result</span>
                        </div>

                        <div className="session-explorer-list">
                            {sessions.map((session) => (
                                <button
                                    className="session-explorer-row"
                                    type="button"
                                    key={session.sessionId}
                                    aria-label={`View session for ${session.visitorLabel}`}
                                    onClick={() =>
                                        setSelectedSession(
                                            session
                                        )
                                    }
                                >
                                    <span className="session-explorer-time">
                                        {
                                            session.startedAtLabel
                                        }
                                    </span>

                                    <span className="session-explorer-visitor">
                                        {session.visitorLabel}
                                    </span>

                                    <span className="session-explorer-device">
                                        {session.device}
                                    </span>

                                    <span className="session-explorer-progress">
                                        <strong>
                                            {session.deepestChapterNumber >
                                                0
                                                ? `Chapter ${session.deepestChapterNumber}`
                                                : "Beginning"}
                                        </strong>

                                        <small>
                                            {
                                                session.deepestChapterTitle
                                            }
                                        </small>
                                    </span>

                                    <span className="session-explorer-duration">
                                        {session.durationLabel}
                                    </span>

                                    <span
                                        className={`session-explorer-outcome session-explorer-outcome--${session.outcome}`}
                                    >
                                        {getOutcomeLabel(
                                            session.outcome
                                        )}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {selectedSession ? (
                <div
                    className="session-journey-overlay"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget
                        ) {
                            setSelectedSession(null);
                        }
                    }}
                >
                    <aside
                        className="session-journey-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="session-journey-title"
                    >
                        <div className="session-journey-header">
                            <div>
                                <p className="dashboard-panel-eyebrow">
                                    Visitor journey
                                </p>

                                <h2 id="session-journey-title">
                                    {
                                        selectedSession.visitorLabel
                                    }
                                </h2>
                            </div>

                            <button
                                className="session-journey-close"
                                type="button"
                                aria-label="Close visitor journey"
                                onClick={() =>
                                    setSelectedSession(null)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <div className="session-journey-meta">
                            <div>
                                <span>Arrived</span>
                                <strong>
                                    {
                                        selectedSession.startedAtLabel
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Device</span>
                                <strong>
                                    {selectedSession.device}
                                </strong>
                            </div>

                            <div>
                                <span>Duration</span>
                                <strong>
                                    {
                                        selectedSession.durationLabel
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Result</span>
                                <strong>
                                    {getOutcomeLabel(
                                        selectedSession.outcome
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="session-journey-progress">
                            <span>Deepest point</span>

                            <p>
                                {selectedSession.deepestChapterNumber >
                                    0
                                    ? `Chapter ${selectedSession.deepestChapterNumber} — ${selectedSession.deepestChapterTitle}`
                                    : "The beginning of the experience"}
                            </p>
                        </div>

                        <div className="session-journey-timeline">
                            {selectedSession.events.map(
                                (event) => (
                                    <div
                                        className={`session-journey-event session-journey-event--${getJourneyEventClass(
                                            event
                                        )}`}
                                        key={event.id}
                                    >
                                        <div className="session-journey-marker">
                                            <span />
                                        </div>

                                        <div className="session-journey-event-copy">
                                            <div>
                                                <strong>
                                                    {event.label}
                                                </strong>

                                                <span>
                                                    {
                                                        event.elapsedLabel
                                                    }
                                                </span>
                                            </div>

                                            <small>
                                                {
                                                    event.occurredAtLabel
                                                }
                                            </small>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </aside>
                </div>
            ) : null}
        </>
    );
}