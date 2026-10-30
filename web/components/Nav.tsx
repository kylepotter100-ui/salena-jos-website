import { BookLink } from "./BookLink";
import { Z, btnPrimarySmall, wrap } from "@/lib/ui";

export function Nav() {
  return (
    <header className="sticky top-0 bg-bg" style={{ zIndex: Z.nav }}>
      <nav aria-label="Main" className={`${wrap} flex h-[72px] items-center justify-between gap-6`}>
        <a href="#top" className="flex items-center gap-3 text-lg font-bold tracking-tight">
          <picture>
            <source srcSet="/brand/crown-light.png" media="(prefers-color-scheme: dark)" />
            <img src="/brand/crown-ink.png" alt="" width={34} height={30} className="h-[30px] w-auto" />
          </picture>
          Salena-Jo&rsquo;s
        </a>
        <div className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 text-[15px] font-medium md:flex">
            <li><a href="#treatments" className="transition-colors hover:text-accent-text">Treatments</a></li>
            <li><a href="#academy" className="transition-colors hover:text-accent-text">Academy</a></li>
            <li><a href="#visit" className="transition-colors hover:text-accent-text">Visit</a></li>
          </ul>
          <BookLink className={btnPrimarySmall} />
        </div>
      </nav>
    </header>
  );
}
