"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { IMAGES } from "@/lib/site";
import { wrap } from "@/lib/ui";

// Layout family: full-bleed zoom. The salon's own shopfront photo opens from a framed picture to the
// full width as you scroll, which is the moment the page arrives at the real place. Static on phones
// and under reduced motion.
export function Shopfront() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.7], reduce ? [1, 1] : [0.62, 1]);

  return (
    <section ref={ref} aria-labelledby="shop-heading" className="relative md:h-[190dvh]">
      <div className="flex flex-col md:sticky md:top-[72px] md:h-[calc(100dvh-72px)]">
        <div className={`${wrap} py-10 md:py-8`}>
          <h2 id="shop-heading" className="text-4xl font-bold leading-[1] tracking-tighter md:text-5xl">
            Find us at number 64.
          </h2>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:flex-1">
          <motion.div style={{ scale }} className="absolute inset-0 origin-top max-md:!scale-100">
            <Image
              src={IMAGES.shopfront.src}
              alt={IMAGES.shopfront.alt}
              fill
              sizes="100vw"
              className="object-cover object-[50%_30%]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
