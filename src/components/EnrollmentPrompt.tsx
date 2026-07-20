"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type PromptStage = "dot" | "fse" | "join" | "enroll";

type CloseReason =
    | "close_button"
    | "outside_click"
    | "continue_exploring"
    | "go_to_enrollment"
    | "escape_key";

const promptContent: Record<
    PromptStage,
    {
        label: string;
        headline: string;
        body: string;
        action: string;
    }
> = {
    dot: {
        label: "Feminine Sales Engine",
        headline: "You are only beginning the experience.",
        body:
            "Keep exploring. Each chapter is designed to help you decide whether Feminine Sales Engine is the right next step.",
        action: "Continue exploring",
    },

    fse: {
        label: "Feminine Sales Engine",
        headline: "Curious about where this is leading?",
        body:
            "You are discovering the philosophy behind a business that creates authority, demand, and premium sales differently.",
        action: "Continue exploring",
    },

    join: {
        label: "Feminine Sales Engine",
        headline: "You have seen the philosophy. Now you are seeing the system.",
        body:
            "Your enrollment is waiting whenever you feel ready to step into the complete Feminine Sales Engine experience.",
        action: "Explore enrollment",
    },

    enroll: {
        label: "Feminine Sales Engine",
        headline: "You are not buying another course.",
        body:
            "You are building the business this entire experience has been describing.",
        action: "Explore enrollment",
    },
};

export default function EnrollmentPrompt() {
    const [stage, setStage] = useState<PromptStage>("dot");

    const toggleRef = useRef<HTMLInputElement>(null);

    const openSourceRef = useRef("floating_prompt");
    const closeReasonRef = useRef<CloseReason>("close_button");

    useEffect(() => {
        const stageMap: Record<string, PromptStage> = {
            "chapter-one": "dot",
            "chapter-two": "dot",
            "chapter-three": "fse",
            "chapter-four": "fse",
            "chapter-five": "join",
            "chapter-six": "join",
            "chapter-seven": "join",
            "chapter-eight": "enroll",
            "chapter-nine": "enroll",
        };

        let frameId = 0;
        let lastStage: PromptStage = "dot";

        const updateStage = () => {
            window.cancelAnimationFrame(frameId);

            frameId = window.requestAnimationFrame(() => {
                const viewportCenter = window.innerHeight * 0.5;

                const chapters = Array.from(
                    document.querySelectorAll<HTMLElement>(
                        '[id^="chapter-"]'
                    )
                );

                let activeStage: PromptStage = "dot";

                for (const chapter of chapters) {
                    const rect = chapter.getBoundingClientRect();

                    const containsViewportCenter =
                        rect.top <= viewportCenter &&
                        rect.bottom >= viewportCenter;

                    if (containsViewportCenter) {
                        activeStage =
                            stageMap[chapter.id] ?? "dot";

                        break;
                    }
                }

                if (activeStage !== lastStage) {
                    lastStage = activeStage;
                    setStage(activeStage);
                }
            });
        };

        updateStage();

        window.addEventListener("scroll", updateStage, {
            passive: true,
        });

        window.addEventListener("resize", updateStage);

        const intervalId = window.setInterval(updateStage, 500);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.clearInterval(intervalId);

            window.removeEventListener("scroll", updateStage);
            window.removeEventListener("resize", updateStage);
        };
    }, []);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== "Escape") return;
            if (!toggleRef.current?.checked) return;

            toggleRef.current.checked = false;

            void trackEvent("enrollment_close", {
                sectionId: "enrollment-prompt",
                metadata: {
                    closeReason: "escape_key",
                    promptStage: stage,
                },
            });
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [stage]);

    function handlePromptToggle(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const isOpen = event.currentTarget.checked;

        if (isOpen) {
            void trackEvent("enrollment_open", {
                sectionId: "enrollment-prompt",
                metadata: {
                    source: openSourceRef.current,
                    promptStage: stage,
                },
            });

            return;
        }

        void trackEvent("enrollment_close", {
            sectionId: "enrollment-prompt",
            metadata: {
                closeReason: closeReasonRef.current,
                promptStage: stage,
            },
        });

        closeReasonRef.current = "close_button";
    }

    function prepareOpen() {
        openSourceRef.current = "floating_prompt";
    }

    function prepareClose(reason: CloseReason) {
        closeReasonRef.current = reason;
    }

    function goToEnrollment(
        event: React.MouseEvent<HTMLAnchorElement>
    ) {
        event.preventDefault();

        if (toggleRef.current?.checked) {
            toggleRef.current.checked = false;

            void trackEvent("enrollment_close", {
                sectionId: "enrollment-prompt",
                metadata: {
                    closeReason: "go_to_enrollment",
                    promptStage: stage,
                },
            });
        }

        window.requestAnimationFrame(() => {
            document.querySelector("#enrollment")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    }

    const content = promptContent[stage];

    return (
        <div
            className="enrollment-prompt"
            data-stage={stage}
        >
            <input
                ref={toggleRef}
                id="fse-enrollment-prompt"
                className="enrollment-prompt-toggle"
                type="checkbox"
                aria-hidden="true"
                onChange={handlePromptToggle}
            />

            <label
                className="enrollment-prompt-backdrop"
                htmlFor="fse-enrollment-prompt"
                aria-label="Close enrollment prompt"
                onClick={() => prepareClose("outside_click")}
            />

            <div
                className="enrollment-prompt-panel"
                role="dialog"
                aria-label="Feminine Sales Engine enrollment"
            >
                <label
                    className="enrollment-prompt-close"
                    htmlFor="fse-enrollment-prompt"
                    aria-label="Close enrollment prompt"
                    onClick={() => prepareClose("close_button")}
                >
                    ×
                </label>

                <p className="enrollment-prompt-label">
                    {content.label}
                </p>

                <h2>{content.headline}</h2>

                <p className="enrollment-prompt-copy">
                    {content.body}
                </p>

                {stage === "dot" || stage === "fse" ? (
                    <label
                        className="enrollment-prompt-cta"
                        htmlFor="fse-enrollment-prompt"
                        onClick={() =>
                            prepareClose("continue_exploring")
                        }
                    >
                        <span>{content.action}</span>
                        <span aria-hidden="true">↓</span>
                    </label>
                ) : (
                    <a
                        className="enrollment-prompt-cta"
                        href="#enrollment"
                        onClick={goToEnrollment}
                    >
                        <span>{content.action}</span>
                        <span aria-hidden="true">→</span>
                    </a>
                )}
            </div>

            <label
                className="enrollment-prompt-trigger"
                htmlFor="fse-enrollment-prompt"
                aria-label="Open Feminine Sales Engine prompt"
                onClick={prepareOpen}
            >
                <span
                    className="prompt-stage prompt-stage-dot"
                    aria-hidden="true"
                >
                    <i />
                </span>

                <span className="prompt-stage prompt-stage-fse">
                    FSE
                </span>

                <span className="prompt-stage prompt-stage-join">
                    Join
                </span>

                <span className="prompt-stage prompt-stage-enroll">
                    Enroll <i aria-hidden="true">→</i>
                </span>
            </label>
        </div>
    );
}