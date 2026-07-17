"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

type ThoughtSequenceProps = {
  heading: string;
  thoughts: string[];
};

export default function ThoughtSequence({
  heading,
  thoughts,
}: ThoughtSequenceProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  return (
    <section
      ref={ref}
      className="thought-sequence"
    >
      <p className="thought-sequence-heading">
        {heading}
      </p>

      <div className="thought-sequence-list">
        {thoughts.map((thought, index) => (
          <Thought
            key={thought}
            text={thought}
            progress={scrollYProgress}
            index={index}
            total={thoughts.length}
          />
        ))}
      </div>
    </section>
  );
}