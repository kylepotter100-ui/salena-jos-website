import { Reveal } from "./Reveal";
import { wrap } from "@/lib/ui";

// Layout family: editorial manifesto. Type only, set large and pushed off-centre on the grid.
export function Statement() {
  return (
    <section aria-labelledby="statement-heading" className="py-14 md:py-28">
      <div className={`${wrap} grid grid-cols-1 lg:grid-cols-12`}>
        <Reveal as="h2" className="lg:col-span-10 lg:col-start-3">
          <span
            id="statement-heading"
            className="block text-4xl font-semibold leading-[1.08] tracking-tight text-balance md:text-5xl lg:text-6xl"
          >
            Over twenty years in the beauty industry, now on Ashby Road. Come in for one treatment and leave feeling{" "}
            <span className="text-accent-text">looked after.</span>
          </span>
        </Reveal>
      </div>
    </section>
  );
}
