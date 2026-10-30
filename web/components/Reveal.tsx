"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Rises content in as it enters the viewport, so each section reads in order. Static under reduced motion.
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "h2" | "li";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      // Under reduced motion the content still reaches its final state, just instantly.
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20, delay }}
    >
      {children}
    </Tag>
  );
}
