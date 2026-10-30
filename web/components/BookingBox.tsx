"use client";

import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight, Check, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { CHOOSE_TREATMENT_EVENT, DAY_NAMES, EMAIL, HOURS, PHONE_DISPLAY, PHONE_HREF, TREATMENTS, formatTime } from "@/lib/site";
import { btnPrimary, linkUnderline, wrap } from "@/lib/ui";

// Layout family: offset single-column form. A four-step booking box (treatment, date and time, details,
// confirm), following the Potter Sanctuary booking flow. There is no booking backend yet: confirming opens
// the visitor's email app with the booking filled in, and the salon texts back to confirm.

type Step = 1 | 2 | 3 | 4 | 5;
type Details = { name: string; phone: string; email: string; notes: string };
type DetailErrors = Partial<Record<"name" | "phone" | "email", string>>;

const STEPS = ["Treatment", "Date", "Details", "Confirm"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const BOOKING_WINDOW_DAYS = 60;

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// Request times: every 30 minutes from opening until an hour before closing. Today only offers times at least an hour away.
function slotsFor(date: Date, now: Date): number[] {
  const hours = HOURS[date.getDay()];
  if (!hours) return [];
  const isToday = dayKey(date) === dayKey(now);
  const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + 60 : 0;
  const out: number[] = [];
  for (let m = hours[0]; m <= hours[1] - 60; m += 30) if (m >= earliest) out.push(m);
  return out;
}

function longDate(d: Date) {
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function validate(f: Details): DetailErrors {
  const e: DetailErrors = {};
  const digits = f.phone.replace(/\D/g, "");
  if (f.name.trim().length < 2) e.name = "Enter your name so we know who to reply to.";
  if (!digits) e.phone = "Enter a mobile number we can text.";
  else if (!/^(07\d{9}|447\d{9})$/.test(digits)) e.phone = "Enter a UK mobile number, for example 07700 900123.";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Check your email address.";
  return e;
}

const field =
  "w-full border border-slate bg-bg px-4 text-base text-ink placeholder:text-muted outline-none transition-[border-color] focus:border-slate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate";
const errorText = "flex items-center gap-1.5 text-sm font-medium text-accent-text";
const backBtn =
  "inline-flex h-12 items-center gap-2 px-2 text-[15px] font-semibold text-ink transition-colors hover:text-accent-text";

function Progress({ step }: { step: Step }) {
  return (
    <ol className="mb-8 flex items-center" aria-label="Booking progress">
      {STEPS.map((label, i) => {
        const n = (i + 1) as Step;
        const done = step > n;
        const current = step === n;
        return (
          <li key={label} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`} aria-current={current ? "step" : undefined}>
            <span className="flex items-center gap-2.5">
              <span
                className={`flex size-7 shrink-0 items-center justify-center transition-colors duration-300 ${
                  done || current ? "bg-slate text-slate-ink" : "border border-line text-muted"
                }`}
                aria-hidden="true"
              >
                {done ? <Check size={14} weight="bold" /> : <span className={`size-1.5 ${current ? "bg-slate-ink" : "bg-line"}`} />}
              </span>
              <span className={`text-sm font-semibold ${current ? "text-ink" : "sr-only text-muted sm:not-sr-only"}`}>
                {label}
                {done && <span className="sr-only"> (done)</span>}
              </span>
            </span>
            {i < STEPS.length - 1 && <span className={`mx-3 h-px flex-1 ${done ? "bg-slate" : "bg-line"}`} aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="mt-8 flex flex-wrap items-center justify-between gap-4">{children}</div>;
}

export const BookingBox = memo(function BookingBox() {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const [step, setStep] = useState<Step>(1);
  const [treatment, setTreatment] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [details, setDetails] = useState<Details>({ name: "", phone: "", email: "", notes: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof DetailErrors, boolean>>>({});
  const [tried, setTried] = useState(false);
  const [opening, setOpening] = useState(false);

  // Dates depend on the visitor's clock, so they are worked out after hydration.
  useEffect(() => {
    const n = new Date();
    setNow(n);
    setView({ y: n.getFullYear(), m: n.getMonth() });
  }, []);

  // "Book a visit" links on treatments jump straight to the date step with that treatment chosen.
  useEffect(() => {
    const onChoose = (e: Event) => {
      setTreatment((e as CustomEvent<string>).detail);
      setStep(2);
    };
    window.addEventListener(CHOOSE_TREATMENT_EVENT, onChoose);
    return () => window.removeEventListener(CHOOSE_TREATMENT_EVENT, onChoose);
  }, []);

  // On a step change, bring the top of the box back into view if it has scrolled above the screen.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = box.current;
    if (el && el.getBoundingClientRect().top < 72) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: reduce ? "auto" : "smooth" });
    }
  }, [step, reduce]);

  useEffect(() => {
    if (!opening) return;
    const t = setTimeout(() => {
      setOpening(false);
      setStep(5);
    }, 700);
    return () => clearTimeout(t);
  }, [opening]);

  const chosen = TREATMENTS.find((t) => t.id === treatment);
  const errors = useMemo(() => validate(details), [details]);
  const showErr = (k: keyof DetailErrors) => (touched[k] || tried ? errors[k] : undefined);

  const calendar = useMemo(() => {
    if (!now || !view) return null;
    const today = startOfDay(now);
    const last = new Date(today.getFullYear(), today.getMonth(), today.getDate() + BOOKING_WINDOW_DAYS);
    const firstOfMonth = new Date(view.y, view.m, 1);
    const lead = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const cells: { key: string; date: Date | null; available: boolean }[] = [];
    for (let i = 0; i < lead; i++) cells.push({ key: `lead-${i}`, date: null, available: false });
    for (let d = 1; d <= daysInMonth; d++) {
      const day = new Date(view.y, view.m, d);
      const inRange = day >= today && day <= last;
      cells.push({ key: dayKey(day), date: day, available: inRange && slotsFor(day, now).length > 0 });
    }
    const canPrev = view.y > today.getFullYear() || (view.y === today.getFullYear() && view.m > today.getMonth());
    const canNext = new Date(view.y, view.m + 1, 1) <= last;
    return { cells, canPrev, canNext, anyAvailable: cells.some((c) => c.available) };
  }, [now, view]);

  const slots = date && now ? slotsFor(date, now) : [];

  function shiftMonth(by: number) {
    setView((v) => (v ? { y: new Date(v.y, v.m + by, 1).getFullYear(), m: new Date(v.y, v.m + by, 1).getMonth() } : v));
  }

  function toDetails() {
    if (date && time !== null) setStep(3);
  }

  function toConfirm() {
    setTried(true);
    if (Object.keys(errors).length) {
      const firstBad = (["name", "phone", "email"] as const).find((k) => errors[k]);
      if (firstBad) document.getElementById(`bk-${firstBad}`)?.focus();
      return;
    }
    setStep(4);
  }

  function confirmAndBook() {
    if (!chosen || !date || time === null) return;
    const body = [
      "Hello Salena-Jo's,",
      "",
      "I'd like to book:",
      `Treatment: ${chosen.name}`,
      `Date: ${longDate(date)}`,
      `Time: ${formatTime(time)}`,
      `Name: ${details.name.trim()}`,
      `Mobile: ${details.phone.trim()}`,
      details.email.trim() ? `Email: ${details.email.trim()}` : "",
      details.notes.trim() ? `Notes: ${details.notes.trim()}` : "",
      "",
      "Please text me to confirm.",
    ]
      .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
      .join("\n");
    setOpening(true);
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Booking: ${chosen.name}, ${longDate(date)} at ${formatTime(time)}`)}&body=${encodeURIComponent(body)}`;
  }

  function reset() {
    setStep(1);
    setTreatment("");
    setDate(null);
    setTime(null);
    setDetails({ name: "", phone: "", email: "", notes: "" });
    setTouched({});
    setTried(false);
  }

  const pane = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    transition: reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 120, damping: 22 },
  };

  return (
    <section id="book" aria-labelledby="book-heading" className="py-14 md:py-24">
      <div className={wrap}>
        <div className="lg:ml-[16.666%] lg:max-w-[920px]">
          <h2 id="book-heading" className="text-5xl font-bold leading-[0.95] tracking-tighter md:text-6xl">
            Book a visit.
          </h2>
          <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-muted">
            Choose a treatment, pick a day and time, and we&rsquo;ll text you to confirm your booking.
          </p>

          <div ref={box} className="mt-8 border-2 border-slate bg-surface p-5 md:p-10">
            {step < 5 && <Progress step={step} />}

            {step === 1 && (
              <motion.div key="s1" {...pane}>
                <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Choose a treatment</h3>
                <p className="mt-1 text-[15px] text-muted">Select one to continue.</p>
                <div className="mt-6 grid gap-2" role="radiogroup" aria-label="Treatment">
                  {TREATMENTS.map((t) => {
                    const on = treatment === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setTreatment(t.id)}
                        className={`flex items-center justify-between gap-4 border-2 p-4 text-left transition-[border-color,background-color] duration-300 active:scale-[0.99] md:p-5 ${
                          on ? "border-slate bg-bg" : "border-transparent bg-bg hover:border-line"
                        }`}
                      >
                        <span>
                          <span className="block text-lg font-bold">{t.name}</span>
                          <span className="mt-0.5 block text-[15px] leading-snug text-muted">{t.line}</span>
                        </span>
                        <span
                          className={`flex size-7 shrink-0 items-center justify-center transition-colors duration-300 ${on ? "bg-slate text-slate-ink" : "border border-line"}`}
                          aria-hidden="true"
                        >
                          {on && <Check size={14} weight="bold" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <Actions>
                  <span />
                  <button type="button" disabled={!treatment} onClick={() => setStep(2)} className={`${btnPrimary} disabled:pointer-events-none disabled:opacity-40`}>
                    Continue <CaretRight size={16} weight="bold" />
                  </button>
                </Actions>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" {...pane}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Choose a date and time</h3>
                  <button type="button" onClick={() => setStep(1)} className={`${linkUnderline} text-[15px]`}>
                    {chosen?.name ?? "Treatment"}: change
                  </button>
                </div>

                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-lg font-bold" aria-live="polite">
                        {view ? `${MONTHS[view.m]} ${view.y}` : " "}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          aria-label="Previous month"
                          disabled={!calendar?.canPrev}
                          onClick={() => shiftMonth(-1)}
                          className="flex size-10 items-center justify-center border border-line bg-bg transition-colors hover:border-slate disabled:opacity-30"
                        >
                          <CaretLeft size={16} weight="bold" />
                        </button>
                        <button
                          type="button"
                          aria-label="Next month"
                          disabled={!calendar?.canNext}
                          onClick={() => shiftMonth(1)}
                          className="flex size-10 items-center justify-center border border-line bg-bg transition-colors hover:border-slate disabled:opacity-30"
                        >
                          <CaretRight size={16} weight="bold" />
                        </button>
                      </div>
                    </div>
                    {calendar ? (
                      <div className="grid grid-cols-7 gap-1">
                        {DOW.map((d) => (
                          <span key={d} className="py-2 text-center text-[13px] font-semibold text-muted">
                            {d}
                          </span>
                        ))}
                        {calendar.cells.map((c) => {
                          if (!c.date) return <span key={c.key} aria-hidden="true" />;
                          const selected = !!date && dayKey(date) === c.key;
                          return (
                            <button
                              key={c.key}
                              type="button"
                              disabled={!c.available}
                              aria-pressed={selected}
                              aria-label={`${longDate(c.date)}${c.available ? "" : ", not available"}`}
                              onClick={() => {
                                setDate(c.date);
                                setTime(null);
                              }}
                              className={`aspect-square text-[15px] font-semibold tabular-nums transition-colors duration-200 ${
                                selected
                                  ? "bg-slate text-slate-ink"
                                  : c.available
                                    ? "bg-bg text-ink hover:bg-surface-2"
                                    : "text-muted/50 line-through"
                              }`}
                            >
                              {c.date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="aspect-[7/6] w-full animate-pulse bg-surface-2" aria-hidden="true" />
                    )}
                    {calendar && !calendar.anyAvailable && (
                      <p className="mt-3 text-[15px] text-muted">No days left this month. Try the next month, or call us.</p>
                    )}
                  </div>

                  <div>
                    <p className="text-lg font-bold">Available times</p>
                    <p className="mt-1 text-[15px] text-muted">{date ? longDate(date) : "Pick a date to see times."}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {slots.map((m) => {
                        const on = time === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setTime(m)}
                            className={`h-12 text-[15px] font-semibold tabular-nums transition-colors duration-200 ${on ? "bg-slate text-slate-ink" : "bg-bg text-ink hover:bg-surface-2"}`}
                          >
                            {formatTime(m)}
                          </button>
                        );
                      })}
                    </div>
                    {date && slots.length === 0 && <p className="mt-3 text-[15px] text-muted">No times left on this day. Choose another date.</p>}
                  </div>
                </div>

                {date && (
                  <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2 bg-bg p-4">
                    <span className="text-[15px] text-muted">Selected</span>
                    <span className="text-lg font-bold">
                      {longDate(date)}
                      {time !== null ? `, ${formatTime(time)}` : ", pick a time"}
                    </span>
                  </div>
                )}

                <Actions>
                  <button type="button" onClick={() => setStep(1)} className={backBtn}>
                    <CaretLeft size={16} weight="bold" /> Back
                  </button>
                  <button type="button" disabled={!date || time === null} onClick={toDetails} className={`${btnPrimary} disabled:pointer-events-none disabled:opacity-40`}>
                    Continue <CaretRight size={16} weight="bold" />
                  </button>
                </Actions>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" {...pane}>
                <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Your details</h3>
                <p className="mt-1 text-[15px] text-muted">We only use these to confirm your visit.</p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {(
                    [
                      { k: "name", label: "Full name", type: "text", auto: "name", help: "" },
                      { k: "phone", label: "Mobile number", type: "tel", auto: "tel", help: "We text to confirm, for example 07700 900123." },
                      { k: "email", label: "Email (optional)", type: "email", auto: "email", help: "" },
                    ] as const
                  ).map((f) => (
                    <div key={f.k} className={`flex flex-col gap-2 ${f.k === "email" ? "md:col-span-2" : ""}`}>
                      <label htmlFor={`bk-${f.k}`} className="text-[15px] font-semibold">
                        {f.label}
                      </label>
                      <input
                        id={`bk-${f.k}`}
                        type={f.type}
                        autoComplete={f.auto}
                        inputMode={f.type === "tel" ? "tel" : f.type === "email" ? "email" : undefined}
                        value={details[f.k]}
                        onChange={(e) => setDetails((d) => ({ ...d, [f.k]: e.target.value }))}
                        onBlur={() => setTouched((t) => ({ ...t, [f.k]: true }))}
                        aria-invalid={!!showErr(f.k)}
                        aria-describedby={`bk-${f.k}-help bk-${f.k}-error`}
                        className={`${field} h-14 ${f.type === "tel" ? "tabular-nums" : ""}`}
                      />
                      <p id={`bk-${f.k}-help`} className={f.help ? "text-sm text-muted" : "sr-only"}>
                        {f.help}
                      </p>
                      {showErr(f.k) && (
                        <p id={`bk-${f.k}-error`} className={errorText}>
                          <WarningCircle size={16} weight="bold" />
                          {showErr(f.k)}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="bk-notes" className="text-[15px] font-semibold">
                      Anything we should know? (optional)
                    </label>
                    <textarea
                      id="bk-notes"
                      rows={3}
                      value={details.notes}
                      onChange={(e) => setDetails((d) => ({ ...d, notes: e.target.value }))}
                      aria-describedby="bk-notes-help"
                      className={`${field} resize-y py-3`}
                    />
                    <p id="bk-notes-help" className="text-sm text-muted">
                      For example a first visit, gel removal or a colour in mind.
                    </p>
                  </div>
                </div>
                <Actions>
                  <button type="button" onClick={() => setStep(2)} className={backBtn}>
                    <CaretLeft size={16} weight="bold" /> Back
                  </button>
                  <button type="button" onClick={toConfirm} className={btnPrimary}>
                    Continue <CaretRight size={16} weight="bold" />
                  </button>
                </Actions>
              </motion.div>
            )}

            {step === 4 && chosen && date && time !== null && (
              <motion.div key="s4" {...pane}>
                <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Check and confirm</h3>
                <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 bg-bg p-5 text-[15px] md:p-6 md:text-base">
                  {[
                    ["Treatment", chosen.name],
                    ["Date", longDate(date)],
                    ["Time", formatTime(time)],
                    ["Name", details.name.trim()],
                    ["Mobile", details.phone.trim()],
                    ...(details.email.trim() ? [["Email", details.email.trim()]] : []),
                    ...(details.notes.trim() ? [["Notes", details.notes.trim()]] : []),
                  ].map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted">{k}</dt>
                      <dd className="break-words font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
                {chosen.id === "browlash" && (
                  <p className="mt-4 bg-bg p-4 text-[15px] leading-relaxed">
                    Tints need a patch test at least 48 hours before your first appointment. We&rsquo;ll arrange it when we confirm.
                  </p>
                )}
                <p className="mt-4 text-sm text-muted">Confirming opens your email with the booking ready to send. We text you back to confirm.</p>
                <Actions>
                  <button type="button" onClick={() => setStep(3)} className={backBtn}>
                    <CaretLeft size={16} weight="bold" /> Back
                  </button>
                  <button type="button" onClick={confirmAndBook} disabled={opening} aria-busy={opening} className={`${btnPrimary} disabled:opacity-70`}>
                    {opening ? "Opening your email" : "Confirm & book"}
                  </button>
                </Actions>
              </motion.div>
            )}

            {step === 5 && chosen && date && time !== null && (
              <motion.div key="s5" {...pane} role="status">
                <CheckCircle size={44} weight="regular" className="text-slate" />
                <h3 className="mt-5 text-3xl font-bold tracking-tight">Almost booked.</h3>
                <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-muted">
                  Your email app should have opened with your {chosen.name.toLowerCase()} booking for {longDate(date)} at {formatTime(time)}. Press
                  send and we&rsquo;ll text {details.phone.trim()} to confirm. If nothing opened, email {EMAIL}.
                </p>
                <button type="button" onClick={reset} className={`${linkUnderline} mt-6 text-base`}>
                  Make another booking
                </button>
              </motion.div>
            )}
          </div>

          <div className="mt-8 md:mt-10">
            <p className="text-2xl font-bold tracking-tight">Prefer to call?</p>
            <a
              href={PHONE_HREF}
              aria-label={`Call ${PHONE_DISPLAY}`}
              className="mt-1 inline-block text-4xl font-bold tracking-tight tabular-nums text-slate transition-colors hover:text-accent-text md:text-5xl"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});
