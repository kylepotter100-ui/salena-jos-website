"use client";

import { memo } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { BookLink } from "./BookLink";
import { IMAGES, PHONE_HREF } from "@/lib/site";
import { LABEL, btnPrimary, btnSecondary, wrap } from "@/lib/ui";

const ease = [0.16, 1, 0.3, 1] as const;

// Layout family: asymmetric split. Text left on the grid, the portrait bleeds to the right edge.
export const Hero = memo(function Hero() {
  const reduce = useReducedMotion();
  // The server-rendered start state is always the same; reduced motion only changes the duration to zero.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.9, delay, ease },
  });

  return (
    <section id="top" className="relative">
      <div className={`${wrap} grid min-h-[calc(100dvh-72px)] grid-cols-1 gap-10 pt-10 pb-12 lg:grid-cols-12 lg:gap-8 lg:pt-12 lg:pb-8`}>
        <div className="flex flex-col justify-center lg:col-span-6 lg:pr-6">
          <motion.h1
            {...rise(0.1)}
            className="text-5xl font-bold leading-[0.95] tracking-tighter text-balance md:text-6xl xl:text-[88px]"
          >
            For all your beauty needs.
          </motion.h1>
          <motion.p {...rise(0.22)} className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted md:text-xl">
            A Loughborough salon for nails, skin, brows and lashes, run by a qualified beauty lecturer with twenty years behind her.
          </motion.p>
          <motion.div {...rise(0.34)} className="mt-9 flex flex-wrap gap-3">
            <BookLink className={`${btnPrimary} group`}>
              <ArrowRight size={18} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
            </BookLink>
            <a href={PHONE_HREF} className={btnSecondary}>
              {LABEL.call}
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative lg:col-span-6 lg:-mr-8"
          initial={{ clipPath: "inset(12% 0 0 0)", opacity: 0 }}
          animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 1.2, delay: 0.15, ease }}
        >
          <Image
            src={IMAGES.hero.src}
            alt={IMAGES.hero.alt}
            width={IMAGES.hero.w}
            height={IMAGES.hero.h}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/5] w-full object-cover lg:aspect-auto lg:h-[calc(100dvh-72px-5rem)]"
          />
        </motion.div>
      </div>
    </section>
  );
});
