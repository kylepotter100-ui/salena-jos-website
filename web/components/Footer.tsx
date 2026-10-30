import { Reveal } from "./Reveal";
import { ADDRESS_LINES, EMAIL, PHONE_HREF } from "@/lib/site";
import { LABEL, wrap } from "@/lib/ui";

// Layout family: statement footer. The way to get in touch is the display line; the rest sits small beneath.
export function Footer() {
  return (
    <footer className="bg-surface pt-14 pb-10 md:pt-24">
      <div className={wrap}>
        <Reveal>
          <p className="mb-3 text-2xl font-bold tracking-tight text-muted md:mb-4 md:text-3xl">Prefer to call?</p>
          <a
            href={PHONE_HREF}
            className="block text-[clamp(40px,8vw,120px)] font-bold leading-[0.9] tracking-tighter tabular-nums transition-colors duration-300 hover:text-accent-text"
          >
            {LABEL.call}
          </a>
        </Reveal>
        <div className="mt-10 grid md:mt-14 grid-cols-1 gap-8 text-[15px] md:grid-cols-12">
          <p className="md:col-span-4">
            Salena-Jo&rsquo;s
            <br />
            {ADDRESS_LINES.join(", ")}
          </p>
          <p className="md:col-span-3">
            <a href={`mailto:${EMAIL}`} className="underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-text">
              {EMAIL}
            </a>
          </p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-3">
            <a href="#treatments" className="hover:text-accent-text">Treatments</a>
            <a href="#academy" className="hover:text-accent-text">Academy</a>
            <a href="#visit" className="hover:text-accent-text">Visit</a>
          </nav>
          <p className="text-muted md:col-span-2 md:text-right">&copy; 2026 Salena-Jo&rsquo;s</p>
        </div>
      </div>
    </footer>
  );
}
