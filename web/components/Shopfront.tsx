"use client";

import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { IMAGES } from "@/lib/site";
import { wrap } from "@/lib/ui";

// Layout family: full-bleed zoom. The salon's own shopfront photo opens from a framed picture to the
// full width as you scroll, which is the moment the page arrives at the real place.
// Desktop pins the photo while it grows; phones grow it as it scrolls into view. Static under reduced motion.

function useWide() {
  const [wide, setWide] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

const Heading = ({ className }: { className: string }) => (
  <div className={`${wrap} ${className}`}>
    <h2 id="shop-heading" className="text-4xl font-bold leading-[1] tracking-tighter md:text-5xl">
      Find us at number 64.
    </h2>
  </div>
);

const Photo = () => (
  <Image src={IMAGES.shopfront.src} alt={IMAGES.shopfront.alt} fill sizes="100vw" className="object-cover object-[50%_30%]" />
);

// Mounted separately from the phone version so each useScroll binds to its own, already-attached target.
function DesktopZoom({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.7], reduce ? [1, 1] : [0.62, 1]);
  return (
    <section ref={ref} aria-labelledby="shop-heading" className="relative h-[190dvh]">
      <div className="sticky top-[72px] flex h-[calc(100dvh-72px)] flex-col">
        <Heading className="py-8" />
        <div className="relative flex-1 overflow-hidden">
          <motion.div style={{ scale }} className="absolute inset-0 origin-top">
            <Photo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PhoneZoom({ reduce }: { reduce: boolean }) {
  const frame = useRef<HTMLDivElement>(null);
  // From the photo's top entering the bottom of the screen until its centre reaches the middle.
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.78, 1]);
  return (
    <section aria-labelledby="shop-heading">
      <Heading className="pb-6" />
      <div ref={frame} className="relative aspect-[4/5] w-full overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0 origin-center">
          <Photo />
        </motion.div>
      </div>
    </section>
  );
}

export const Shopfront = memo(function Shopfront() {
  const reduce = !!useReducedMotion();
  const wide = useWide();
  // Before the first measurement, render the phone layout at full size so nothing jumps on load.
  if (wide === null) {
    return (
      <section aria-labelledby="shop-heading">
        <Heading className="pb-6 md:py-8" />
        <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[16/9]">
          <Photo />
        </div>
      </section>
    );
  }
  return wide ? <DesktopZoom reduce={reduce} /> : <PhoneZoom reduce={reduce} />;
});
