import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { OpenStatus } from "./OpenStatus";
import { Reveal } from "./Reveal";
import { ADDRESS_LINES, EMAIL, MAPS_HREF, PHONE_HREF } from "@/lib/site";
import { LABEL, linkUnderline, wrap } from "@/lib/ui";

const HOURS_ROWS = [
  { day: "Wednesday", time: "9:30am - 8pm" },
  { day: "Thursday", time: "11:30am - 8pm" },
  { day: "Friday", time: "9:30am - 5pm" },
  { day: "Saturday", time: "10am - 4pm" },
  { day: "Sunday to Tuesday", time: "Closed" },
];

// Layout family: typographic info grid. No picture: three columns of set type, the address as the display line.
export function Visit() {
  return (
    <section id="visit" aria-labelledby="visit-heading" className="py-14 md:py-24">
      <div className={wrap}>
        <h2 id="visit-heading" className="sr-only">
          Visit the salon
        </h2>
        <Reveal className="text-[clamp(44px,7vw,112px)] font-bold leading-[0.92] tracking-tighter">
          <address className="not-italic">
            {ADDRESS_LINES[0]},<br />
            {ADDRESS_LINES[1]} {ADDRESS_LINES[2]}
          </address>
        </Reveal>

        <div className="mt-10 grid md:mt-14 grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-5" delay={0.06}>
            <OpenStatus />
            <dl className="mt-8 grid max-w-md grid-cols-[1fr_auto] gap-x-8 gap-y-3 text-lg">
              {HOURS_ROWS.map((r) => (
                <div key={r.day} className="contents">
                  <dt className="text-muted">{r.day}</dt>
                  <dd className="text-right font-medium tabular-nums">{r.time}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="flex flex-col gap-6 md:col-span-6 md:col-start-7" delay={0.12}>
            <a href={PHONE_HREF} className="w-fit text-4xl font-bold tracking-tight tabular-nums transition-colors hover:text-accent-text md:text-5xl">
              {LABEL.call}
            </a>
            <a href={`mailto:${EMAIL}`} className={`${linkUnderline} w-fit text-lg`}>
              {EMAIL}
            </a>
            <a href={MAPS_HREF} target="_blank" rel="noopener" className={`${linkUnderline} inline-flex w-fit items-center gap-2 text-lg`}>
              {LABEL.directions}
              <ArrowUpRight size={18} weight="bold" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
