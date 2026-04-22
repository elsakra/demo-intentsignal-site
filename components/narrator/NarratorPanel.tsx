"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PlumbingDrawer } from "@/components/narrator/PlumbingDrawer";

export type PipelineLine = { key: string; text: string; at?: string; done?: boolean };

const STAGGER = 0.12;

type Props = {
  lines: PipelineLine[];
  streamProgress: number;
  tElapsed: string;
  onOpenPlumbing: () => Promise<Record<string, unknown>> | Record<string, unknown>;
  /** Shown in collapsed pill, e.g. "340" */
  identifyMsHint?: string;
};

/**
 * Top-right pill when collapsed; expands to full log; auto-collapses after 8s (unless reduced motion).
 * Expands when #approach scrolls into view.
 */
export function NarratorPanel({
  lines,
  streamProgress,
  tElapsed,
  onOpenPlumbing,
  identifyMsHint = "340",
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [plumb, setPlumb] = useState(false);
  const [reduced, setReduced] = useState(false);
  const openRef = useRef<() => void>(() => setExpanded(true));

  useEffect(() => {
    openRef.current = () => setExpanded(true);
  }, []);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const l = () => setReduced(m.matches);
    m.addEventListener("change", l);
    return () => m.removeEventListener("change", l);
  }, []);

  useEffect(() => {
    const el = document.getElementById("approach");
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) openRef.current();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!expanded || reduced) return;
    const t = window.setTimeout(() => setExpanded(false), 8_000);
    return () => clearTimeout(t);
  }, [expanded, reduced]);

  const loader = useCallback(() => onOpenPlumbing(), [onOpenPlumbing]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!expanded && (
          <motion.button
            key="pill"
            type="button"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            onClick={() => setExpanded(true)}
            className="fixed right-3 top-20 z-40 max-w-[min(100vw-1.5rem,320px)] rounded-full border border-ink/20 bg-ink/95 px-3 py-2 text-left font-mono text-[10px] text-cream shadow-lg backdrop-blur sm:right-5 sm:top-24 sm:px-4 sm:text-xs"
            aria-expanded={false}
            aria-label="Open live pipeline log"
          >
            <span className="text-signal">●</span> live — identified in ~{identifyMsHint}ms
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <motion.aside
            key="panel"
            role="complementary"
            aria-label="IntentSignal live pipeline"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed right-3 top-20 z-40 w-[min(100vw-1.5rem,420px)] border border-white/10 bg-[#0E0E0E] p-3 text-[#E9E3D4] shadow-[0_24px_60px_-20px_rgba(10,10,10,0.5)] sm:right-5 sm:top-24 sm:max-w-sm md:max-w-md"
          >
            <div className="mb-2 flex items-center gap-1.5 border-b border-dashed border-white/10 pb-2">
              <div className="flex gap-1">
                <i className="h-2 w-2 rounded-full bg-signal" />
                <i className="h-2 w-2 rounded-full bg-zinc-600" />
                <i className="h-2 w-2 rounded-full bg-zinc-600" />
              </div>
              <div className="font-mono text-xs text-[#D6D1BF]">intentsignal · live</div>
              <div className="ml-auto text-[9px] uppercase tracking-wider text-[#7a7770]">
                {tElapsed}
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="ml-1 rounded border border-white/20 px-1.5 py-0.5 text-[9px] text-[#7a7770] hover:text-cream"
              >
                min
              </button>
            </div>
            <div className="max-h-52 overflow-y-auto pr-0.5">
              {lines.map((l, i) => (
                <motion.div
                  key={l.key}
                  className="grid grid-cols-[22px_1fr_auto] items-baseline gap-1.5 py-0.5 text-[12.5px] leading-[1.65] font-mono"
                  initial={reduced ? false : { opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { delay: i * STAGGER, duration: 0.18, ease: "easeOut" }
                  }
                >
                  <span className="text-[#6ea87e]">
                    {l.done === false ? "◐" : "✓"}
                  </span>
                  <span className="text-[#D6D1BF]">{l.text}</span>
                  {l.at && (
                    <span className="text-right text-[10px] text-[#6A6761]">
                      {l.at}
                    </span>
                  )}
                </motion.div>
              ))}
              {streamProgress > 0 && (
                <div className="mt-1.5 flex gap-0.5 pl-6" aria-hidden>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <i
                      key={i}
                      className={cn(
                        "h-1.5 min-w-0 flex-1",
                        i < streamProgress * 10 ? "bg-signal" : "bg-zinc-800"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-between border border-white/20 px-2 py-1.5 text-left font-mono text-xs text-[#6ea87e] hover:border-signal/40"
              onClick={() => setPlumb(true)}
            >
              <span>▸</span>{" "}
              <span className="text-[#D6D1BF]">Show me the plumbing</span>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
      <PlumbingDrawer
        open={plumb}
        onOpenChange={setPlumb}
        getPayload={loader}
      />
    </>
  );
}
