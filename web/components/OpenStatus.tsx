"use client";

import { useEffect, useState, memo } from "react";
import { DAY_NAMES, HOURS, formatTime } from "@/lib/site";

function status(now: Date) {
  const dow = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = HOURS[dow];
  if (today && mins >= today[0] && mins < today[1]) return { open: true, text: `Open now until ${formatTime(today[1])}` };
  if (today && mins < today[0]) return { open: false, text: `Closed now. Opens today at ${formatTime(today[0])}` };
  for (let i = 1; i <= 7; i++) {
    const d = (dow + i) % 7;
    const h = HOURS[d];
    if (h) return { open: false, text: `Closed now. Opens ${i === 1 ? "tomorrow" : DAY_NAMES[d]} at ${formatTime(h[0])}` };
  }
  return { open: false, text: "Closed now" };
}

// The page's one status dot: it shows real, live opening state from the hours above.
export const OpenStatus = memo(function OpenStatus() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <p className="h-7 w-56 animate-pulse bg-surface" aria-hidden="true" />;
  const s = status(now);
  return (
    <p className="flex items-center gap-3 text-lg font-semibold" aria-live="polite">
      <span className={`size-2.5 ${s.open ? "bg-accent" : "bg-muted"}`} aria-hidden="true" />
      {s.text}
    </p>
  );
});
