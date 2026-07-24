"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

type InsightProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: Direction;
    distance?: number;
};

export default function Insight({
    children,
    className,
    delay = 0,
    direction = "up",
    distance = 32,
}: InsightProps) {
    const offsets: Record<Direction, { x: number; y: number }> = {
        up: { x: 0, y: distance },
        down: { x: 0, y: -distance },
        left: { x: distance, y: 0 },
        right: { x: -distance, y: 0 },
    };

    const { x, y } = offsets[direction];

    return (
        <motion.div
            className={className}
            initial={false}
            whileInView={{
                opacity: [0, 1],
                x: [x, 0],
                y: [y, 0],
            }}
            viewport={{
                once: true,
                amount: 0.05,
            }}
            transition={{
                duration: 0.85,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}