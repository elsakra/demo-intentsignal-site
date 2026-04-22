"use client";

import { useEffect, useState } from "react";
import type { PublicHeroCopy } from "@/lib/types";

/**
 * Batched delete/type (chunk + short ticks) so a long hero does not take many
 * seconds. Skips the animation when prefers-reduced-motion: reduce.
 */
const CHUNK = 5;
const DEL_TICK_MS = 2;
const TYPE_TICK_MS = 2;
const SUB_DELAY_MS = 40;
const CTA_DELAY_MS = 60;

function usePrefersReducedMotion() {
  const [m, setM] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setM(q.matches);
    const l = () => setM(q.matches);
    q.addEventListener("change", l);
    return () => q.removeEventListener("change", l);
  }, []);
  return m;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useStreamingText(opts: {
  base: PublicHeroCopy;
  target: PublicHeroCopy | null;
  active: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const [h1, setH1] = useState(opts.base.hero_h1);
  const [sub, setSub] = useState(opts.base.hero_subhead);
  const [cta, setCta] = useState(opts.base.cta);
  const [banner, setBanner] = useState<string | null>(opts.base.banner ?? null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setH1(opts.base.hero_h1);
    setSub(opts.base.hero_subhead);
    setCta(opts.base.cta);
    setBanner(opts.base.banner ?? null);
  }, [opts.base.hero_h1, opts.base.hero_subhead, opts.base.cta, opts.base.banner]);

  useEffect(() => {
    if (!opts.active || !opts.target) {
      setIsTransitioning(false);
      return;
    }

    const t = opts.target;
    const b = opts.base;
    let alive = true;

    const run = async () => {
      if (!alive) return;
      setIsTransitioning(true);

      if (reduced) {
        if (!alive) {
          setIsTransitioning(false);
          return;
        }
        setH1(t.hero_h1);
        setSub(t.hero_subhead);
        setCta(t.cta);
        setBanner(t.banner ?? null);
        if (alive) setIsTransitioning(false);
        return;
      }

      async function wipe(s: string, set: (x: string) => void) {
        let n = s.length;
        while (n > 0) {
          if (!alive) return;
          n = Math.max(0, n - CHUNK);
          set(s.slice(0, n));
          await wait(DEL_TICK_MS);
        }
        if (alive) set("");
      }

      async function typeIn(full: string, set: (s: string) => void) {
        for (let pos = 0; pos < full.length; pos += CHUNK) {
          if (!alive) return;
          set(full.slice(0, Math.min(pos + CHUNK, full.length)));
          await wait(TYPE_TICK_MS);
        }
        if (alive) set(full);
      }

      await wipe(b.hero_h1, setH1);
      if (!alive) return;
      await wipe(b.hero_subhead, setSub);
      if (!alive) return;
      await wipe(b.cta, setCta);
      if (!alive) return;

      await wait(SUB_DELAY_MS);
      if (!alive) return;
      await typeIn(t.hero_h1, setH1);
      if (!alive) return;
      await wait(SUB_DELAY_MS);
      if (!alive) return;
      await typeIn(t.hero_subhead, setSub);
      if (!alive) return;
      await wait(CTA_DELAY_MS);
      if (!alive) return;
      await typeIn(t.cta, setCta);
      if (!alive) return;
      setBanner(t.banner ?? null);
      if (alive) setIsTransitioning(false);
    };

    void run();

    return () => {
      alive = false;
      setIsTransitioning(false);
    };
    // `opts.target` / `opts.base` by reference would re-run the transition when parents
    // pass a new object with identical field values; we key off copy fields + active.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    opts.active,
    opts.target?.hero_h1,
    opts.target?.hero_subhead,
    opts.target?.cta,
    opts.target?.banner,
    opts.base.hero_h1,
    opts.base.hero_subhead,
    opts.base.cta,
    reduced,
  ]);

  return { h1, sub, cta, banner, reduced, isTransitioning };
}
