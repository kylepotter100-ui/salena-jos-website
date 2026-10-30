"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { wrap } from "@/lib/ui";

// Layout family: editorial manifesto. Type only, set large and pushed off-centre on the grid.
// The section is taller than the screen: the statement pins in the middle of the viewport and its words
// light up in reading order as you scroll, so it is read as one sentence at the centre of the page.
// Under reduced motion it renders at full strength in normal flow.

const LEAD = "Over twenty years in the beauty industry, now on Ashby Road. Come in for one treatment and leave feeling";
const ACCENT = "looked after.";
const WORDS = [...LEAD.split(" ").map((w) => ({ w, accent: false })), ...ACCENT.split(" ").map((w) => ({ w, accent: true }))];

function Word({ word, accent, progress, range }: { word: string; accent: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={accent ? "text-accent-text" : undefined}>
      {word}
    </motion.span>
  );
}

const textClass = "block text-4xl font-semibold leading-[1.08] tracking-tight text-balance md:text-5xl lg:text-6xl";

export const Statement = memo(function Statement() {
  const prefersReduced = useReducedMotion();
  // Applied after hydration so the first client render matches the server-rendered pinned layout.
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(!!prefersReduced), [prefersReduced]);
  const ref = useRef<HTMLElement>(null);
  // 0 when the section top meets the bottom of the nav (the text is centred and pinned), 1 when the pin ends.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 72px", "end end"] });

  if (reduce) {
    return (
      <section aria-labelledby="statement-heading" className="py-14 md:py-28">
        <div className={`${wrap} grid grid-cols-1 lg:grid-cols-12`}>
          <h2 id="statement-heading" className={`${textClass} lg:col-span-10 lg:col-start-3`}>
            {LEAD} <span className="text-accent-text">{ACCENT}</span>
          </h2>
        </div>
      </section>
    );
  }

  // The words finish lighting at 85% of the pin, so the full sentence holds for a moment before it scrolls on.
  const step = 0.85 / WORDS.length;
  return (
    <section ref={ref} aria-labelledby="statement-heading" className="relative h-[200dvh]">
      <div className="sticky top-[72px] flex h-[calc(100dvh-72px)] items-center">
        <div className={`${wrap} grid w-full grid-cols-1 lg:grid-cols-12`}>
          <h2 id="statement-heading" aria-label={`${LEAD} ${ACCENT}`} className={`${textClass} lg:col-span-10 lg:col-start-3`}>
            {WORDS.map((x, i) => (
              <span key={i} aria-hidden="true">
                <Word word={x.w} accent={x.accent} progress={scrollYProgress} range={[i * step, i * step + step * 1.6]} />
                {i < WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
});
