"use client";

import { CHOOSE_TREATMENT_EVENT } from "@/lib/site";
import { LABEL } from "@/lib/ui";
import { memo, type ReactNode } from "react";

// Every booking link on the page uses this one label. When it names a treatment, the form preselects it.
export const BookLink = memo(function BookLink({
  treatment,
  className,
  children,
}: {
  treatment?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href="#book"
      className={className}
      onClick={() => {
        if (treatment) window.dispatchEvent(new CustomEvent(CHOOSE_TREATMENT_EVENT, { detail: treatment }));
      }}
    >
      {LABEL.book}
      {children}
    </a>
  );
});
