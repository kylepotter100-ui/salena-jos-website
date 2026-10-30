import Image from "next/image";
import { ChatCircleText, Drop, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { IMAGES } from "@/lib/site";
import { wrap } from "@/lib/ui";

// Layout family: bento. Five facts, five cells: two pictures, one accent tile, two tone tiles.
// Desktop grid is 6 columns by 2 rows; it collapses to one column under 768px.
export function GoodToKnow() {
  return (
    <section aria-labelledby="know-heading" className="py-24 md:py-36">
      <div className={wrap}>
        <Reveal as="h2" className="max-w-[16ch] text-5xl font-bold leading-[0.95] tracking-tighter md:text-6xl">
          <span id="know-heading">Good to know before you come.</span>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-[minmax(280px,1fr)_minmax(280px,1fr)]">
          <Reveal className="relative min-h-[420px] overflow-hidden bg-surface md:col-span-2 md:row-span-2 md:min-h-0">
            <Image
              src={IMAGES.polish.src}
              alt={IMAGES.polish.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={0.06} className="flex flex-col justify-between gap-10 bg-accent p-8 text-accent-ink md:col-span-2">
            <Drop size={32} weight="regular" />
            <p className="text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
              Brow or lash tint? Book a patch test at least 48 hours before.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="relative min-h-[280px] overflow-hidden bg-surface md:col-span-2">
            <Image
              src={IMAGES.towels.src}
              alt={IMAGES.towels.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={0.18} className="flex flex-col justify-between gap-10 bg-surface p-8 md:col-span-2">
            <Sparkle size={32} weight="regular" className="text-accent-text" />
            <p className="text-2xl font-semibold leading-snug tracking-tight">
              CACI results build over a course. We&rsquo;ll suggest how many sessions suit you.
            </p>
          </Reveal>

          <Reveal delay={0.24} className="flex flex-col justify-between gap-10 bg-surface p-8 md:col-span-2">
            <ChatCircleText size={32} weight="regular" className="text-accent-text" />
            <p className="text-2xl font-semibold leading-snug tracking-tight">
              Every request is confirmed with you directly before it&rsquo;s booked in.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
