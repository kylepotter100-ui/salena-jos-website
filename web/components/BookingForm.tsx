"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { CHOOSE_TREATMENT_EVENT, DAY_NAMES, EMAIL, HOURS, PHONE_HREF, TREATMENTS } from "@/lib/site";
import { LABEL, btnPrimary, linkUnderline, wrap } from "@/lib/ui";

type Fields = { treatment: string; name: string; phone: string; day: string; time: string; notes: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "opening" | "sent";

const TIMES = ["Morning", "Afternoon", "Evening"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function openDays(from: Date, count = 21) {
  const days: { value: string; label: string }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const hours = HOURS[d.getDay()];
    if (!hours) continue;
    // Today only counts while there is at least an hour of opening left.
    if (i === 0 && from.getHours() * 60 + from.getMinutes() > hours[1] - 60) continue;
    const label = `${i === 0 ? "Today, " : i === 1 ? "Tomorrow, " : ""}${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
    days.push({ value: label, label });
  }
  return days;
}

function validate(f: Fields): Errors {
  const e: Errors = {};
  const digits = f.phone.replace(/\D/g, "");
  if (!f.treatment) e.treatment = "Choose the treatment you'd like.";
  if (f.name.trim().length < 2) e.name = "Enter your name so we know who to reply to.";
  if (!digits) e.phone = "Enter a mobile number we can text.";
  else if (!/^(07\d{9}|447\d{9})$/.test(digits)) e.phone = "Enter a UK mobile number, for example 07700 900123.";
  if (!f.day) e.day = "Choose a day that suits you.";
  return e;
}

const fieldBase =
  "w-full border border-muted bg-surface px-4 text-base text-ink placeholder:text-muted outline-none transition-[border-color] focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const errorText = "flex items-center gap-1.5 text-sm font-medium text-accent-text";

// Layout family: offset single-column form. The heading leads, the form sits indented on the grid.
// Submitting opens the visitor's email app with the request filled in, so nothing pretends to send.
export function BookingForm() {
  const reduce = useReducedMotion();
  const [f, setF] = useState<Fields>({ treatment: "", name: "", phone: "", day: "", time: "", notes: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [days, setDays] = useState<{ value: string; label: string }[] | null>(null);

  useEffect(() => setDays(openDays(new Date())), []);

  useEffect(() => {
    const onChoose = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setF((prev) => ({ ...prev, treatment: id }));
      setStatus("idle");
    };
    window.addEventListener(CHOOSE_TREATMENT_EVENT, onChoose);
    return () => window.removeEventListener(CHOOSE_TREATMENT_EVENT, onChoose);
  }, []);

  useEffect(() => {
    if (status !== "opening") return;
    const t = setTimeout(() => setStatus("sent"), 700);
    return () => clearTimeout(t);
  }, [status]);

  const errors = useMemo(() => validate(f), [f]);
  const show = (k: keyof Fields) => (touched[k] || submitted ? errors[k] : undefined);
  const set = (k: keyof Fields) => (v: string) => setF((prev) => ({ ...prev, [k]: v }));
  const treatmentName = TREATMENTS.find((t) => t.id === f.treatment)?.name ?? "";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      const first = (Object.keys(errors) as (keyof Fields)[])[0];
      document.getElementById(`book-${first}`)?.focus();
      return;
    }
    const body = [
      "Hello Salena-Jo's,",
      "",
      "I'd like to book:",
      `Treatment: ${treatmentName}`,
      `Day: ${f.day}`,
      `Time of day: ${f.time || "Any"}`,
      `Name: ${f.name.trim()}`,
      `Mobile: ${f.phone.trim()}`,
      f.notes.trim() ? `Notes: ${f.notes.trim()}` : "",
      "",
      "Please text me to confirm a time.",
    ]
      .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
      .join("\n");
    setStatus("opening");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Booking request: ${treatmentName}`)}&body=${encodeURIComponent(body)}`;
  }

  function reset() {
    setF({ treatment: "", name: "", phone: "", day: "", time: "", notes: "" });
    setTouched({});
    setSubmitted(false);
    setStatus("idle");
  }

  return (
    <section id="book" aria-labelledby="book-heading" className="py-24 md:py-36">
      <div className={wrap}>
        <div className="lg:ml-[33.333%] lg:max-w-[760px]">
          <h2 id="book-heading" className="text-5xl font-bold leading-[0.95] tracking-tighter md:text-6xl">
            Book a visit.
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">
            Tell us what you&rsquo;d like and when, and we&rsquo;ll text you to confirm a time. Prefer to talk it through?{" "}
            <a href={PHONE_HREF} className={`${linkUnderline} text-ink`}>
              {LABEL.call}
            </a>
          </p>

          {status === "sent" ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="mt-12 bg-surface p-8 md:p-10"
              role="status"
            >
              <CheckCircle size={40} weight="regular" className="text-accent-text" />
              <h3 className="mt-6 text-3xl font-bold tracking-tight">Your request is ready to send.</h3>
              <p className="mt-3 max-w-[50ch] text-lg leading-relaxed text-muted">
                Your email app should have opened with a {treatmentName.toLowerCase()} request for {f.day}. Press send and
                we&rsquo;ll text {f.phone.trim()} to confirm. If nothing opened, email {EMAIL} or call us.
              </p>
              <button type="button" onClick={reset} className={`${linkUnderline} mt-8 text-base`}>
                Start a new request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="book-treatment" className="text-[15px] font-semibold">Treatment</label>
                <select
                  id="book-treatment"
                  value={f.treatment}
                  onChange={(e) => set("treatment")(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, treatment: true }))}
                  aria-invalid={!!show("treatment")}
                  aria-describedby="book-treatment-help book-treatment-error"
                  className={`${fieldBase} h-14 appearance-none`}
                >
                  <option value="">Choose a treatment</option>
                  {TREATMENTS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <p id="book-treatment-help" className="text-sm text-muted">Booking more than one? Add the rest in the notes.</p>
                {show("treatment") && <p id="book-treatment-error" className={errorText}><WarningCircle size={16} weight="bold" />{show("treatment")}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="book-name" className="text-[15px] font-semibold">Full name</label>
                <input
                  id="book-name"
                  autoComplete="name"
                  value={f.name}
                  onChange={(e) => set("name")(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  aria-invalid={!!show("name")}
                  aria-describedby="book-name-error"
                  className={`${fieldBase} h-14`}
                />
                {show("name") && <p id="book-name-error" className={errorText}><WarningCircle size={16} weight="bold" />{show("name")}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="book-phone" className="text-[15px] font-semibold">Mobile number</label>
                <input
                  id="book-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={f.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                  aria-invalid={!!show("phone")}
                  aria-describedby="book-phone-help book-phone-error"
                  className={`${fieldBase} h-14 tabular-nums`}
                />
                <p id="book-phone-help" className="text-sm text-muted">We text to confirm, for example 07700 900123.</p>
                {show("phone") && <p id="book-phone-error" className={errorText}><WarningCircle size={16} weight="bold" />{show("phone")}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="book-day" className="text-[15px] font-semibold">Preferred day</label>
                {days === null ? (
                  <div className="h-14 w-full animate-pulse bg-surface" aria-hidden="true" />
                ) : days.length === 0 ? (
                  <p className="flex min-h-14 items-center bg-surface px-4 text-base">
                    No open days in the next three weeks. Please call us to book.
                  </p>
                ) : (
                  <select
                    id="book-day"
                    value={f.day}
                    onChange={(e) => set("day")(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, day: true }))}
                    aria-invalid={!!show("day")}
                    aria-describedby="book-day-help book-day-error"
                    className={`${fieldBase} h-14 appearance-none`}
                  >
                    <option value="">Choose a day</option>
                    {days.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                )}
                <p id="book-day-help" className="text-sm text-muted">Open Wednesday to Saturday.</p>
                {show("day") && <p id="book-day-error" className={errorText}><WarningCircle size={16} weight="bold" />{show("day")}</p>}
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-[15px] font-semibold">Time of day</legend>
                <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup">
                  {TIMES.map((t) => {
                    const on = f.time === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => set("time")(on ? "" : t)}
                        className={`h-14 border text-[15px] font-semibold transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.98] ${
                          on ? "border-accent bg-accent text-accent-ink" : "border-muted bg-surface text-ink hover:border-ink"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-muted">Optional. Leave blank for any time.</p>
              </fieldset>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="book-notes" className="text-[15px] font-semibold">Anything we should know?</label>
                <textarea
                  id="book-notes"
                  rows={3}
                  value={f.notes}
                  onChange={(e) => set("notes")(e.target.value)}
                  aria-describedby="book-notes-help"
                  className={`${fieldBase} resize-y py-3`}
                />
                <p id="book-notes-help" className="text-sm text-muted">Optional. For example a first visit, gel removal or a colour in mind.</p>
              </div>

              <div className="flex flex-wrap items-center gap-6 md:col-span-2">
                <button type="submit" disabled={status === "opening"} aria-busy={status === "opening"} className={`${btnPrimary} disabled:opacity-70`}>
                  {status === "opening" ? "Opening your email app" : "Send request"}
                </button>
                <p className="text-sm text-muted">We only use your details to arrange this visit.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
