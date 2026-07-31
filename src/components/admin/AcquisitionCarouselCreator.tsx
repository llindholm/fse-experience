"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type WorkflowStep =
    | "strategy"
    | "sources"
    | "structure"
    | "draft";

type CarouselSlide = {
    id: number;
    role: string;
    copy: string;
};

const workflowSteps: {
    id: WorkflowStep;
    number: string;
    label: string;
}[] = [
    {
        id: "strategy",
        number: "01",
        label: "Strategy",
    },
    {
        id: "sources",
        number: "02",
        label: "Sources",
    },
    {
        id: "structure",
        number: "03",
        label: "Structure",
    },
    {
        id: "draft",
        number: "04",
        label: "Draft",
    },
];

const initialSlides: CarouselSlide[] = [
    {
        id: 1,
        role: "Hook",
        copy:
            "Maybe you are not inconsistent.",
    },
    {
        id: 2,
        role: "Recognition",
        copy:
            "Maybe your business only knows how to work when you do.",
    },
    {
        id: 3,
        role: "Hidden assumption",
        copy:
            "You have been treating consistency like a personality trait.",
    },
    {
        id: 4,
        role: "Reframe",
        copy:
            "But consistent sales should not require consistent personal performance.",
    },
    {
        id: 5,
        role: "Structural explanation",
        copy:
            "When every sale depends on a fresh post, launch, email, or burst of energy, you are not inconsistent. Your sales architecture is.",
    },
    {
        id: 6,
        role: "Possibility",
        copy:
            "The goal is not to become better at carrying the business. It is to build a business that carries more of the sale.",
    },
    {
        id: 7,
        role: "Invitation",
        copy:
            "There is a quieter way to build demand. Start with the Feminine Sales Engine experience.",
    },
];

const caption = `Maybe you are not inconsistent.

Maybe your business has simply been designed to depend on your daily energy.

When sales slow down every time you stop posting, launching, emailing, or actively promoting, the answer is not always more discipline.

Sometimes the real problem is structural.

A business can be intentionally designed to carry more of the sale — through positioning, content, and a customer journey that continues working after you log off.

That is the shift behind Feminine Sales Engine.

Read the full experience through the link in bio.`;

export default function AcquisitionCarouselCreator() {
    const [activeStep, setActiveStep] =
        useState<WorkflowStep>("strategy");

    const [slides, setSlides] =
        useState<CarouselSlide[]>(initialSlides);

    const [copiedItem, setCopiedItem] =
        useState<string | null>(null);

    const activeStepIndex = useMemo(
        () =>
            workflowSteps.findIndex(
                (step) => step.id === activeStep
            ),
        [activeStep]
    );

    function goToNextStep() {
        const nextStep =
            workflowSteps[activeStepIndex + 1];

        if (nextStep) {
            setActiveStep(nextStep.id);
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }

    function goToPreviousStep() {
        const previousStep =
            workflowSteps[activeStepIndex - 1];

        if (previousStep) {
            setActiveStep(previousStep.id);
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }

    function updateSlide(
        id: number,
        field: "role" | "copy",
        value: string
    ) {
        setSlides((currentSlides) =>
            currentSlides.map((slide) =>
                slide.id === id
                    ? {
                          ...slide,
                          [field]: value,
                      }
                    : slide
            )
        );
    }

    async function copyText(
        key: string,
        value: string
    ) {
        try {
            await navigator.clipboard.writeText(
                value
            );

            setCopiedItem(key);

            window.setTimeout(() => {
                setCopiedItem(null);
            }, 1800);
        } catch {
            setCopiedItem(null);
        }
    }

    return (
        <div className="acquisition-creator">
            <nav
                className="acquisition-workflow-nav"
                aria-label="Carousel creation progress"
            >
                {workflowSteps.map(
                    (step, index) => {
                        const isActive =
                            activeStep === step.id;

                        const isComplete =
                            index < activeStepIndex;

                        return (
                            <button
                                key={step.id}
                                type="button"
                                className={`acquisition-workflow-step ${
                                    isActive
                                        ? "is-active"
                                        : ""
                                } ${
                                    isComplete
                                        ? "is-complete"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveStep(
                                        step.id
                                    )
                                }
                            >
                                <span>
                                    {isComplete
                                        ? "✓"
                                        : step.number}
                                </span>

                                <strong>
                                    {step.label}
                                </strong>
                            </button>
                        );
                    }
                )}
            </nav>

            {activeStep === "strategy" && (
                <section className="acquisition-creator-panel">
                    <div className="acquisition-creator-heading">
                        <div>
                            <p className="acquisition-card-label">
                                Step 01
                            </p>

                            <h2>
                                Review the strategy
                            </h2>
                        </div>

                        <span className="acquisition-status acquisition-status--active">
                            Recommended
                        </span>
                    </div>

                    <p className="acquisition-creator-intro">
                        The strategic decision has already
                        been made. Review the assignment
                        before shaping the content.
                    </p>

                    <div className="acquisition-strategy-grid">
                        <article>
                            <p className="acquisition-card-label">
                                Objective
                            </p>

                            <h3>
                                Grow qualified organic
                                traffic to FSE
                            </h3>

                            <p>
                                Attract ideal clients through
                                a new Instagram discovery
                                account and move them into the
                                FSE sales experience.
                            </p>
                        </article>

                        <article>
                            <p className="acquisition-card-label">
                                Format
                            </p>

                            <h3>
                                Instagram carousel
                            </h3>

                            <p>
                                A recognition-led carousel
                                designed for shares, profile
                                visits, and deeper reading.
                            </p>
                        </article>

                        <article>
                            <p className="acquisition-card-label">
                                Discovery theme
                            </p>

                            <h3>
                                The myth of consistency
                            </h3>

                            <p>
                                Challenge the assumption that
                                inconsistent sales are caused
                                by insufficient discipline.
                            </p>
                        </article>

                        <article>
                            <p className="acquisition-card-label">
                                Experiment
                            </p>

                            <h3>
                                Identity-first messaging
                            </h3>

                            <p>
                                Test whether recognition-led
                                hooks create more qualified
                                FSE readers than educational
                                hooks.
                            </p>
                        </article>
                    </div>

                    <div className="acquisition-belief-shift">
                        <div>
                            <p className="acquisition-card-label">
                                Current belief
                            </p>

                            <blockquote>
                                “I need to become more
                                disciplined.”
                            </blockquote>
                        </div>

                        <span aria-hidden="true">
                            →
                        </span>

                        <div>
                            <p className="acquisition-card-label">
                                Desired belief
                            </p>

                            <blockquote>
                                “My business needs a structure
                                that does not depend on my
                                daily energy.”
                            </blockquote>
                        </div>
                    </div>
                </section>
            )}

            {activeStep === "sources" && (
                <section className="acquisition-creator-panel">
                    <div className="acquisition-creator-heading">
                        <div>
                            <p className="acquisition-card-label">
                                Step 02
                            </p>

                            <h2>
                                Review the source package
                            </h2>
                        </div>
                    </div>

                    <p className="acquisition-creator-intro">
                        These are the strategic sources the
                        final asset should reflect. We are
                        not searching the entire knowledge
                        base—only the material relevant to
                        today’s assignment.
                    </p>

                    <div className="acquisition-source-list">
                        <article className="acquisition-source-card">
                            <div>
                                <span>
                                    Sales experience
                                </span>

                                <h3>
                                    Chapters 1–3
                                </h3>
                            </div>

                            <p>
                                The invisible ceiling, the
                                real reason, and the authority
                                shift. These chapters move the
                                reader from recognizing the
                                symptom to understanding the
                                deeper structural problem.
                            </p>
                        </article>

                        <article className="acquisition-source-card">
                            <div>
                                <span>
                                    Million Dollar Authority
                                </span>

                                <h3>
                                    Highest-cost problem
                                </h3>
                            </div>

                            <p>
                                Avoid treating the surface
                                symptom as the true problem.
                                The carousel should reveal
                                that inconsistency is not the
                                deepest issue.
                            </p>
                        </article>

                        <article className="acquisition-source-card">
                            <div>
                                <span>
                                    Effortless Sell System
                                </span>

                                <h3>
                                    Content that is not
                                    dependent on inspiration
                                </h3>
                            </div>

                            <p>
                                Jess teaches that content can
                                be structured around buyer
                                psychology instead of
                                requiring the creator to be
                                constantly inspired or “on.”
                            </p>
                        </article>

                        <article className="acquisition-source-card">
                            <div>
                                <span>
                                    Signature Close
                                </span>

                                <h3>
                                    Architecture over
                                    personal effort
                                </h3>
                            </div>

                            <p>
                                The sales system should
                                increasingly carry the sale,
                                allowing visibility and active
                                promotion to become optional
                                rather than required.
                            </p>
                        </article>
                    </div>

                    <aside className="acquisition-source-guardrail">
                        <p className="acquisition-card-label">
                            Creative guardrail
                        </p>

                        <p>
                            This asset should create
                            recognition and curiosity. It
                            should not attempt to explain the
                            entire Feminine Sales Engine or
                            turn into a tactical lesson.
                        </p>
                    </aside>
                </section>
            )}

            {activeStep === "structure" && (
                <section className="acquisition-creator-panel">
                    <div className="acquisition-creator-heading">
                        <div>
                            <p className="acquisition-card-label">
                                Step 03
                            </p>

                            <h2>
                                Shape the carousel
                            </h2>
                        </div>
                    </div>

                    <p className="acquisition-creator-intro">
                        Refine the role and purpose of each
                        slide before finalizing the complete
                        draft.
                    </p>

                    <div className="acquisition-slide-editor-list">
                        {slides.map((slide) => (
                            <article
                                key={slide.id}
                                className="acquisition-slide-editor"
                            >
                                <span className="acquisition-slide-number">
                                    {String(
                                        slide.id
                                    ).padStart(2, "0")}
                                </span>

                                <div>
                                    <label>
                                        Slide role
                                        <input
                                            value={
                                                slide.role
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateSlide(
                                                    slide.id,
                                                    "role",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />
                                    </label>

                                    <label>
                                        Core idea
                                        <textarea
                                            value={
                                                slide.copy
                                            }
                                            rows={3}
                                            onChange={(
                                                event
                                            ) =>
                                                updateSlide(
                                                    slide.id,
                                                    "copy",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {activeStep === "draft" && (
                <section className="acquisition-creator-panel">
                    <div className="acquisition-creator-heading">
                        <div>
                            <p className="acquisition-card-label">
                                Step 04
                            </p>

                            <h2>
                                Final carousel draft
                            </h2>
                        </div>

                        <span className="acquisition-status acquisition-status--active">
                            Ready to edit
                        </span>
                    </div>

                    <p className="acquisition-creator-intro">
                        This is the first complete draft.
                        Refine the language, then copy the
                        slides into your design workflow.
                    </p>

                    <div className="acquisition-carousel-preview-grid">
                        {slides.map((slide) => (
                            <article
                                key={slide.id}
                                className="acquisition-carousel-slide"
                            >
                                <div className="acquisition-carousel-slide-topline">
                                    <span>
                                        Slide {slide.id}
                                    </span>

                                    <span>
                                        {slide.role}
                                    </span>
                                </div>

                                <p>
                                    {slide.copy}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        copyText(
                                            `slide-${slide.id}`,
                                            slide.copy
                                        )
                                    }
                                >
                                    {copiedItem ===
                                    `slide-${slide.id}`
                                        ? "Copied"
                                        : "Copy slide"}
                                </button>
                            </article>
                        ))}
                    </div>

                    <article className="acquisition-caption-card">
                        <div className="acquisition-creator-heading">
                            <div>
                                <p className="acquisition-card-label">
                                    Caption
                                </p>

                                <h3>
                                    Supporting copy
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    copyText(
                                        "caption",
                                        caption
                                    )
                                }
                            >
                                {copiedItem === "caption"
                                    ? "Copied"
                                    : "Copy caption"}
                            </button>
                        </div>

                        <p>{caption}</p>
                    </article>

                    <div className="acquisition-finalize-card">
                        <div>
                            <p className="acquisition-card-label">
                                Next step
                            </p>

                            <h3>
                                Design and publish the
                                carousel
                            </h3>

                            <p>
                                Database saving, publication
                                tracking, and Instagram metric
                                entry will be added after we
                                validate this creation
                                workflow.
                            </p>
                        </div>

                        <Link
                            href="/admin/acquisition"
                            className="acquisition-primary-action"
                        >
                            Return to the Lab
                            <span aria-hidden="true">
                                →
                            </span>
                        </Link>
                    </div>
                </section>
            )}

            <div className="acquisition-workflow-actions">
                <button
                    type="button"
                    className="acquisition-secondary-action"
                    onClick={goToPreviousStep}
                    disabled={activeStepIndex === 0}
                >
                    ← Previous
                </button>

                {activeStepIndex <
                workflowSteps.length - 1 ? (
                    <button
                        type="button"
                        className="acquisition-primary-action"
                        onClick={goToNextStep}
                    >
                        Continue
                        <span aria-hidden="true">
                            →
                        </span>
                    </button>
                ) : (
                    <Link
                        href="/admin/acquisition"
                        className="acquisition-primary-action"
                    >
                        Finish
                        <span aria-hidden="true">
                            →
                        </span>
                    </Link>
                )}
            </div>
        </div>
    );
}