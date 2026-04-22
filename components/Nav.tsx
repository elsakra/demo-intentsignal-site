"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Nav() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 border-b border-transparent bg-cream/90 backdrop-blur transition-colors",
        s && "border-line"
      )}
    >
      <div className="mx-auto flex h-full max-w-content items-center justify-between gap-4 px-6 md:px-[72px]">
        <Link href="#top" className="flex items-center gap-3.5">
          <span
            className="relative grid h-6 w-6 place-items-center border border-ink"
            aria-hidden
          >
            <span className="absolute inset-1.5 border border-ink" />
            <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_0_4px_rgba(220,38,38,0.18)]" />
          </span>
          <span
            className="font-mono text-[13px] font-medium tracking-tight"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            intentsignal<span className="text-mute">.ai</span>
          </span>
        </Link>
        <div className="hidden min-w-0 items-center gap-4 overflow-x-auto md:flex md:gap-6">
          <a
            href="#services"
            className="text-[13px] font-medium text-ink/90 hover:underline decoration-signal decoration-1 underline-offset-[3px]"
          >
            Services
          </a>
          <a
            href="#work"
            className="text-[13px] font-medium text-ink/90 hover:underline decoration-signal decoration-1 underline-offset-[3px]"
          >
            Work
          </a>
          <a
            href="#approach"
            className="text-[13px] font-medium text-ink/90 hover:underline decoration-signal decoration-1 underline-offset-[3px]"
          >
            Approach
          </a>
        </div>
        <a
          href="#book"
          className="h-9 shrink-0 bg-ink px-3 font-mono text-[11px] font-medium uppercase tracking-wider text-cream"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Book a call ↗
        </a>
      </div>
    </header>
  );
}
