"use client";

import { useState } from "react";

import type { Lesson } from "@/data/courses";

type SignalFeedProps = {
    lessons: Lesson[];
};

export default function SignalFeed({
    lessons,
}: SignalFeedProps) {
    const [activeSlug, setActiveSlug] =
        useState<string | null>(null);

    function toggleSignal(slug: string) {
        setActiveSlug((currentSlug) =>
            currentSlug === slug ? null : slug
        );
    }

    return (
        <section className="signal-feed">
            <div className="signal-feed__heading">
                <p className="signal-feed__eyebrow">
                    The Archive
                </p>

                <p className="signal-feed__count">
                    {lessons.length}{" "}
                    {lessons.length === 1
                        ? "transmission"
                        : "transmissions"}
                </p>
            </div>

            <div className="signal-feed__list">
                {lessons.map((lesson) => {
                    const isOpen =
                        activeSlug === lesson.slug;

                    const panelId = `signal-${lesson.slug}`;

                    return (
                        <article
                            className={`signal-feed__item${
                                isOpen
                                    ? " signal-feed__item--open"
                                    : ""
                            }`}
                            key={lesson.id}
                        >
                            <button
                                type="button"
                                className="signal-feed__trigger"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() =>
                                    toggleSignal(
                                        lesson.slug
                                    )
                                }
                            >
                                <span className="signal-feed__content">
                                    <span className="signal-feed__title">
                                        {lesson.title}
                                    </span>

                                    {lesson.description && (
                                        <span className="signal-feed__description">
                                            {
                                                lesson.description
                                            }
                                        </span>
                                    )}
                                </span>

                                <span className="signal-feed__duration">
                                    {lesson.duration}
                                </span>

                                <span
                                    className="signal-feed__toggle"
                                    aria-hidden="true"
                                >
                                    {isOpen ? "−" : "+"}
                                </span>
                            </button>

                            {isOpen && (
                                <div
                                    className="signal-feed__panel"
                                    id={panelId}
                                >
                                    {lesson.opening && (
                                        <p className="signal-feed__opening">
                                            {
                                                lesson.opening
                                            }
                                        </p>
                                    )}

                                    {lesson.audioUrl && (
                                        <audio
                                            className="signal-feed__player"
                                            controls
                                            preload="metadata"
                                            src={
                                                lesson.audioUrl
                                            }
                                        />
                                    )}
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}