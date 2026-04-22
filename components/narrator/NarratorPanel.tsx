"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PlumbingDrawer } from "@/components/narrator/PlumbingDrawer";

export type PipelineLine = { key: string; text: string; at?: string; done?: boolean };

const STAGGER = 0.12;

type Props = {
  lines: PipelineLine[];
  streamProgress: number; // 0-1
  tElapsed: string;
  onOpenPlumbing: () => Promise<Record<string, unknown>> | Record<string, unknown>;
};

export function NarratorPanel({ lines, streamProgress, tElapsed, onOpenPlumbing }: Props) {
  const [min, setMin] = useState(false);
  const [plumb, setPlumb] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const l = () => setReduced(m.matches);
    m.addEventListener("change", l);
    return () => m.removeEventListener("change", l);
  }, []);
  useEffect(() => {
    try {
      setMin(localStorage.getItem("narratorMin") === "1");
    } catch {
      // ignore
    }
  }, []);

  if (min) {
    return (
      <button
        type="button"
        className="fixed bottom-4 right-1/2 z-40 h-11 translate-x-1/2 bg-signal px-4 font-mono text-xs font-medium text-white sm:right-6 sm:translate-x-0 md:hidden"
        onClick={() => {
          setMin(false);
          try {
            localStorage.setItem("narratorMin", "0");
          } catch {
            // ignore
          }
        }}
      >
        ▸ show what we did to this page
      </button>
    );
  }
  return (
    <>
      <motion.section
        role="log"
        aria-label="IntentSignal live pipeline"
        className="fixed bottom-4 right-4 z-40 w-[min(100vw-2rem,420px)] border border-[#0E0E0E] bg-[#0E0E0E] p-3 text-[#E9E3D4] shadow-[0_24px_60px_-20px_rgba(10,10,10,0.35)] sm:max-w-sm md:max-w-md"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4, ease: [0.2, 0.9, 0.2, 1] }}
      >
        <div className="mb-2 flex items-center gap-1.5 border-b border-dashed border-white/10 pb-2">
          <div className="flex gap-1">
            <i className="h-2 w-2 rounded-full bg-signal" />
            <i className="h-2 w-2 rounded-full bg-zinc-600" />
            <i className="h-2 w-2 rounded-full bg-zinc-600" />
          </div>
          <div className="font-mono text-xs text-[#D6D1BF]">intentsignal · live pipeline</div>
          <div className="ml-auto text-[9px] uppercase tracking-wider text-[#7a7770]">
            {tElapsed}
          </div>
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
          <span>▸</span> <span className="text-[#D6D1BF]">Show me the plumbing</span>
        </button>
        <button
          type="button"
          className="mt-0.5 w-full text-right font-mono text-[9px] text-[#6A6761] hover:text-[#D6D1BF] md:block"
          onClick={() => {
            setMin(true);
            try {
              localStorage.setItem("narratorMin", "1");
            } catch {
              // ignore
            }
          }}
        >
          — minimize
        </button>
      </motion.section>
      <PlumbingDrawer
        open={plumb}
        onOpenChange={setPlumb}
        getPayload={onOpenPlumbing}
      />
    </>
  );
}
