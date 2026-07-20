"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const SCROLL_THRESHOLDS = [10, 25, 50, 75, 90, 100];

export default function AnalyticsProvider() {
    const pageViewSent = useRef(false);
    const sentScrollThresholds = useRef<Set<number>>(new Set());
    const viewedChapters = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!pageViewSent.current) {
            pageViewSent.current = true;

            void trackEvent("page_view", {
                metadata: {
                    pageTitle: document.title,
                },
            });
        }

        /*
         * Scroll-depth tracking
         */

        let animationFrameId: number | null = null;

        function checkScrollDepth() {
            const documentHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollTop = window.scrollY;
            const scrollableDistance = documentHeight - viewportHeight;

            const scrollPercent =
                scrollableDistance <= 0
                    ? 100
                    : Math.min(
                        100,
                        Math.round((scrollTop / scrollableDistance) * 100)
                    );

            for (const threshold of SCROLL_THRESHOLDS) {
                if (
                    scrollPercent >= threshold &&
                    !sentScrollThresholds.current.has(threshold)
                ) {
                    sentScrollThresholds.current.add(threshold);

                    void trackEvent("scroll_depth", {
                        eventValue: threshold,
                        metadata: {
                            actualScrollPercent: scrollPercent,
                            scrollTop: Math.round(scrollTop),
                            documentHeight,
                            viewportHeight,
                        },
                    });
                }
            }

            animationFrameId = null;
        }

        function handleScroll() {
            if (animationFrameId !== null) return;

            animationFrameId =
                window.requestAnimationFrame(checkScrollDepth);
        }

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        checkScrollDepth();

        /*
         * Chapter tracking
         */

        const chapterElements =
            document.querySelectorAll<HTMLElement>(
                "[data-analytics-chapter]"
            );

        const chapterObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;

                    const element = entry.target as HTMLElement;
                    const chapterId =
                        element.dataset.analyticsChapter;
                    const chapterTitle =
                        element.dataset.analyticsTitle ?? chapterId;

                    if (!chapterId) continue;
                    if (viewedChapters.current.has(chapterId)) continue;

                    viewedChapters.current.add(chapterId);

                    const chapterNumberMatch =
                        chapterId.match(/\d+/);

                    const chapterNumber = chapterNumberMatch
                        ? Number(chapterNumberMatch[0])
                        : undefined;

                    void trackEvent("chapter_view", {
                        sectionId: chapterId,
                        eventValue: chapterNumber,
                        metadata: {
                            chapterTitle,
                            chapterIndex: chapterNumber,
                        },
                    });
                }
            },
            {
                /*
                 * This creates an observation band through the
                 * middle portion of the screen. It works better
                 * than requiring a percentage of very tall chapters
                 * to become visible.
                 */
                root: null,
                rootMargin: "-20% 0px -55% 0px",
                threshold: 0,
            }
        );

        chapterElements.forEach((element) => {
            chapterObserver.observe(element);
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);

            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
            }

            chapterObserver.disconnect();
        };
    }, []);

    return null;
}