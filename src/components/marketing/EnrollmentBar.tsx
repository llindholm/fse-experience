"use client";

import { useEffect, useState } from "react";

export default function EnrollmentBar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const chapterFive = document.querySelector<HTMLElement>(
            ".engine-chapter"
        );

        if (!chapterFive) {
            console.warn("EnrollmentBar could not find .engine-chapter");
            return;
        }

        // Handles refreshing the page after already scrolling beyond Chapter Five.
        if (chapterFive.getBoundingClientRect().top <= window.innerHeight) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.01,
            }
        );

        observer.observe(chapterFive);

        return () => observer.disconnect();
    }, []);

    function handleClick() {
        document.querySelector(".offer-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="enrollment-bar enrollment-bar-visible"
            aria-label="Feminine Sales Engine enrollment"
        >
            <div className="enrollment-bar-copy">
                <span>Feminine Sales Engine</span>
                <p>Build the business that already knows how to sell.</p>
            </div>

            <button type="button" onClick={handleClick}>
                <span>Explore enrollment</span>
                <span aria-hidden="true">→</span>
            </button>
        </div>
    );
}