"use client";

import Image from "next/image";
import { useEffect, useRef, useState, memo } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { BookLink } from "./BookLink";
import { TREATMENTS, type Treatment } from "@/lib/site";
import { wrap } from "@/lib/ui";

// Layout family: horizontal pan. Vertical scroll drives the six treatment panels sideways (desktop),
// so each treatment gets a full picture instead of a row in a list. Phones and reduced motion get a swipe row.

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

function Panel({ t, priority = false }: { t: Treatment; priority?: boolean }) {
  return (
    <article className="group flex w-[78vw] shrink-0 snap-start flex-col sm:w-[46vw] lg:w-[min(34vw,500px)]">
      <div className="overflow-hidden bg-surface">
        <Image
          src={t.image.src}
          alt={t.image.alt}
          width={1536}
          height={2048}
          loading={priority ? "eager" : "lazy"}
          sizes="(min-width: 1024px) 34vw, 78vw"
          className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] lg:aspect-auto lg:h-[58dvh]"
        />
      </div>
      <h3 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">{t.name}</h3>
      <p className="mt-3 max-w-[38ch] text-base leading-relaxed text-muted">{t.line}</p>
      <BookLink
        treatment={t.id}
        className="mt-5 inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-ink underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent-text"
      >
        <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
      </BookLink>
    </article>
  );
}

function Intro() {
  return (
    <div className="flex shrink-0 flex-col justify-end lg:h-[58dvh] lg:w-[min(30vw,440px)]">
      <h2 id="treatments-heading" className="text-5xl font-bold leading-[0.95] tracking-tighter md:text-6xl">
        Pick your treatment.
      </h2>
      <p className="mt-5 max-w-[34ch] text-lg leading-relaxed text-muted">
        Six treatments, each one booked as its own appointment. Choose one and we&rsquo;ll find you a time.
      </p>
    </div>
  );
}

// Mounted only on wide screens with motion allowed, so its refs exist before useScroll binds to them.
function DesktopPan() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distance);

  return (
    <section
      id="treatments"
      ref={section}
      aria-labelledby="treatments-heading"
      className="relative"
      style={{ height: `calc(100dvh + ${distance}px)` }}
    >
      <div className="sticky top-[72px] flex h-[calc(100dvh-72px)] items-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-start gap-10 px-8 will-change-transform">
          <Intro />
          {TREATMENTS.map((t, i) => (
            <Panel key={t.id} t={t} priority={i < 2} />
          ))}
          <div className="w-[8vw] shrink-0" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}

export const TreatmentsPan = memo(function TreatmentsPan() {
  const wide = useWide();
  const reduce = useReducedMotion();
  if (wide && !reduce) return <DesktopPan />;

  return (
    <section id="treatments" aria-labelledby="treatments-heading" className="py-14 md:py-24">
      <div className={wrap}>
        <Intro />
      </div>
      <div
        className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:px-8 [scrollbar-width:none]"
        role="region"
        aria-label="Treatments"
        tabIndex={0}
      >
        {TREATMENTS.map((t) => (
          <Panel key={t.id} t={t} />
        ))}
      </div>
    </section>
  );
});
