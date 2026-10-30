// Shared UI constants. One corner system (all sharp), one accent, one label per intent.

// Z-index scale: the sticky navigation is the only layered element on the page.
export const Z = { nav: 40 } as const;

export const LABEL = {
  book: "Book a visit",
  call: "Call 01509 215678",
  directions: "Get directions",
  courses: "Email about courses",
} as const;

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold " +
  "transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";

export const btnPrimary = `${base} h-12 px-6 text-[15px] bg-accent text-accent-ink hover:bg-ink hover:text-bg`;
export const btnPrimarySmall = `${base} h-11 px-5 text-sm bg-accent text-accent-ink hover:bg-ink hover:text-bg`;
export const btnSecondary = `${base} h-12 px-6 text-[15px] border-2 border-slate text-ink hover:bg-slate hover:text-slate-ink`;

export const linkUnderline =
  "font-semibold underline decoration-accent decoration-2 underline-offset-[6px] transition-colors duration-300 hover:text-accent-text";

export const wrap = "mx-auto w-full max-w-[1400px] px-4 md:px-8";
