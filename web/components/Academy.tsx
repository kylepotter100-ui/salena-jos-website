"use client";

import Image from "next/image";
import { useRef, memo } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { EMAIL, IMAGES } from "@/lib/site";
import { LABEL, btnSecondary, wrap } from "@/lib/ui";

const coursesHref = `mailto:${EMAIL}?subject=${encodeURIComponent("Training Academy courses")}&body=${encodeURIComponent(
  "Hello Salena-Jo,\n\nI'd like to hear about upcoming courses.\n\n"
)}`;

// Layout family: offset collage. A large figure and copy on the left; two pictures overlap on the right
// and drift at different speeds to give the section depth. Stacks to one column under 768px.
export const Academy = memo(function Academy() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const yFront = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, -120]);

  return (
    <section id="academy" ref={ref} aria-labelledby="academy-heading" className="overflow-hidden bg-surface py-24 md:py-36">
      <div className={`${wrap} grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8`}>
        <div className="flex flex-col justify-center md:col-span-5">
          <p aria-hidden="true" className="text-[clamp(120px,18vw,260px)] font-bold leading-[0.8] tracking-tighter text-accent-text">
            20+
          </p>
          <h2 id="academy-heading" className="mt-8 text-4xl font-bold leading-[1] tracking-tighter md:text-5xl">
            Learn the trade from a beauty lecturer.
          </h2>
          <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-muted">
            Salena-Jo is a fully qualified beauty lecturer with over 20 years in the industry. Her training academy runs from the salon.
          </p>
          <a href={coursesHref} className={`${btnSecondary} group mt-8 w-fit`}>
            {LABEL.courses}
            <ArrowUpRight size={18} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="relative md:col-span-7">
          <motion.div style={{ y: yBack }} className="ml-auto w-full md:w-[78%]">
            <Image
              src={IMAGES.tutor.src}
              alt={IMAGES.tutor.alt}
              width={IMAGES.tutor.w}
              height={IMAGES.tutor.h}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>
          <motion.div
            style={{ y: yFront }}
            className="relative -mt-24 w-[62%] md:absolute md:bottom-[-6%] md:left-0 md:mt-0 md:w-[44%]"
          >
            <Image
              src={IMAGES.kit.src}
              alt={IMAGES.kit.alt}
              width={IMAGES.kit.w}
              height={IMAGES.kit.h}
              sizes="(min-width: 768px) 25vw, 62vw"
              className="aspect-square w-full object-cover ring-8 ring-surface"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
});
