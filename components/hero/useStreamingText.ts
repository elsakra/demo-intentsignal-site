"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicHeroCopy } from "@/lib/types";

const DEL_MS = 40;
const TYPE_MS = 25;
const SUB_DELAY = 180;
const CTA_DELAY = 360;

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
  rawStream: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [h1, setH1] = useState(opts.base.hero_h1);
  const [sub, setSub] = useState(opts.base.hero_subhead);
  const [cta, setCta] = useState(opts.base.cta);
  const [banner, setBanner] = useState<string | null>(opts.base.banner ?? null);
  const cancel = useRef(false);

  useEffect(() => {
    setH1(opts.base.hero_h1);
    setSub(opts.base.hero_subhead);
    setCta(opts.base.cta);
    setBanner(opts.base.banner ?? null);
  }, [opts.base.hero_h1, opts.base.hero_subhead, opts.base.cta, opts.base.banner]);

  useEffect(() => {
    if (!opts.active || !opts.target) return;
    cancel.current = false;
    const t = opts.target;
    const b = opts.base;
    const run = async () => {
      if (reduced) {
        if (cancel.current) return;
        setH1(t.hero_h1);
        setSub(t.hero_subhead);
        setCta(t.cta);
        setBanner(t.banner ?? null);
        return;
      }
      for (let i = b.hero_h1.length; i >= 0; i -= 1) {
        if (cancel.current) return;
        setH1(b.hero_h1.slice(0, i));
        await wait(DEL_MS);
      }
      for (let i = b.hero_subhead.length; i >= 0; i -= 1) {
        if (cancel.current) return;
        setSub(b.hero_subhead.slice(0, i));
        await wait(DEL_MS);
      }
      for (let i = b.cta.length; i >= 0; i -= 1) {
        if (cancel.current) return;
        setCta(b.cta.slice(0, i));
        await wait(DEL_MS);
      }
      await wait(SUB_DELAY);
      for (let i = 1; i <= t.hero_h1.length; i += 1) {
        if (cancel.current) return;
        setH1(t.hero_h1.slice(0, i));
        await wait(TYPE_MS);
      }
      await wait(SUB_DELAY);
      for (let i = 1; i <= t.hero_subhead.length; i += 1) {
        if (cancel.current) return;
        setSub(t.hero_subhead.slice(0, i));
        await wait(TYPE_MS);
      }
      await wait(CTA_DELAY);
      for (let i = 1; i <= t.cta.length; i += 1) {
        if (cancel.current) return;
        setCta(t.cta.slice(0, i));
        await wait(TYPE_MS);
      }
      setBanner(t.banner ?? null);
    };
    void run();
    return () => {
      cancel.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate when target or active changes
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

  return { h1, sub, cta, banner, reduced };
}
