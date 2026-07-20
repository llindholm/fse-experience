"use client";

import { trackEvent } from "@/lib/analytics";

type TrackedCheckoutLinkProps = {
    className: string;
    href: string;
    ariaLabel: string;
    source: "enrollment_section" | "final_invitation";
    children: React.ReactNode;
};

export default function TrackedCheckoutLink({
    className,
    href,
    ariaLabel,
    source,
    children,
}: TrackedCheckoutLinkProps) {
    function handleClick() {
        void trackEvent("checkout_click", {
            sectionId: source,
            metadata: {
                source,
                destination: "fse_checkout",
                checkoutUrl: href,
            },
        });
    }

    return (
        <a
            className={className}
            href={href}
            aria-label={ariaLabel}
            onClick={handleClick}
        >
            {children}
        </a>
    );
}