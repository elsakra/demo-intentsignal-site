"use client";

import { formatHeroH1 } from "@/lib/format-hero";
import type { PublicHeroCopy } from "@/lib/types";

type Props = {
  h1: string;
  sub: string;
  cta: string;
  banner: string | null;
  onCtaClick?: () => void;
  className?: string;
};

export function HeroBlock({ h1, sub, cta, banner, onCtaClick, className }: Props) {
  return (
    <div className={className}>
      {banner && (
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-3">
          {banner}
        </p>
      )}
      <h1 className="font-display text-[2.4rem] leading-[0.95] tracking-[-0.025em] text-ink [text-wrap:balance] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.4rem] xl:text-[5.5rem] min-h-[2.1em]">
        {formatHeroH1(h1, { em: "font-light not-italic text-signal" })}
      </h1>
      <p
        className="prose-tight mt-6 max-w-[40rem] min-h-[3.2em] text-base text-ink-3 [text-wrap:balance] sm:text-[1.05rem]"
        style={{ textWrap: "balance" } as never}
      >
        {sub}
      </p>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <a
          href="#book"
          onClick={onCtaClick}
          className="inline-flex h-12 w-fit items-center bg-ink px-5 font-mono text-[11px] font-medium uppercase tracking-wider text-cream"
        >
          {cta} →
        </a>
        <a
          href="#work"
          className="text-sm text-ink-3 underline decoration-1 underline-offset-[3px] hover:decoration-signal"
        >
          See our work ↓
        </a>
      </div>
    </div>
  );
}

export function toPublicFromArchetype(
  a: { hero_h1: string; subhead: string; cta: string }
): PublicHeroCopy {
  return {
    hero_h1: a.hero_h1,
    hero_subhead: a.subhead,
    cta: a.cta,
    banner: null,
  };
}
