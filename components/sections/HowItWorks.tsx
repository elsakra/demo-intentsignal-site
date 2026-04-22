"use client";

import { useState, useCallback } from "react";
import { PlumbingDrawer } from "@/components/narrator/PlumbingDrawer";

const nodes = [
  { k: "00 · trigger", v: "Page view", t: "t = 0ms" },
  { k: "01 · capture", v: "First-party + partner signals", t: "t = 120ms" },
  { k: "02 · resolve", v: "IP → org → person", t: "t = 340ms" },
  { k: "03 · enrich", v: "Firmographics + context", t: "t = 610ms" },
  { k: "04 · rewrite", v: "Model · stream", t: "t = 790–1240ms" },
  { k: "05 · deliver", v: "Downstream + analytics", t: "t = 1260ms" },
  { k: "06 · act", v: "Playbook + humans", t: "t = 1300ms" },
] as const;

type Payload = Record<string, unknown>;

export function HowItWorks({
  getPayload,
}: {
  getPayload: () => Promise<Payload> | Payload;
}) {
  const [open, setOpen] = useState(false);
  const loader = useCallback(() => {
    return getPayload();
  }, [getPayload]);
  return (
    <section id="approach" className="scroll-mt-20 border-b border-line py-20 md:py-24">
      <div className="mx-auto max-w-content px-6 md:px-[72px]">
        <div className="mb-8 grid items-baseline gap-2 md:grid-cols-[120px_1fr] md:gap-12">
          <span className="font-mono text-sm text-signal">08 / 12</span>
          <div>
            <h2 className="font-display text-[2.5rem] leading-tight tracking-[-0.02em] md:text-[2.75rem]">
              The plumbing <em className="font-light not-italic text-signal">reveal</em>.
            </h2>
            <p className="mt-2 max-w-[50ch] text-ink-3">
              Stages are labeled abstractly: no vendor names, same pipeline.
            </p>
          </div>
        </div>
        <div className="arch overflow-hidden border border-panel bg-panel px-4 py-7 text-[#D6D1BF] sm:px-7">
          <div className="arch-row flex min-h-[7rem] items-stretch gap-0 overflow-x-auto pb-2">
            {nodes.map((n, i) => (
              <div key={n.k} className="flex min-w-0 items-center">
                {i > 0 && (
                  <div className="arch-link flex w-9 shrink-0 items-center justify-center text-[9px] text-[#6A6761]">
                    <span className="relative z-[1] bg-panel px-0.5">→</span>
                  </div>
                )}
                <div className="arch-node min-w-[130px] border border-[#2a2925] bg-[#141311] p-3.5 text-[12px]">
                  <span className="k text-[9.5px] uppercase leading-tight tracking-[0.12em] text-[#8A8578]">
                    {n.k}
                  </span>
                  <span className="mt-1 block text-[#fff]">{n.v}</span>
                  <span className="m mt-0.5 block text-[10px] text-signal">
                    {n.t}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="arch-note mt-4 flex flex-col gap-3 border-t border-dashed border-[#2a2925] pt-3 text-[12px] text-[#D6D1BF] sm:flex-row sm:items-center sm:justify-between">
            <div>
              This pipeline ran on <span className="text-signal">YOU</span>, a few
              seconds ago.
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-fit border border-[#4a4740] px-2.5 py-1.5 text-left text-[11px] text-[#E9E3D4] transition-colors hover:border-signal/50"
            >
              ▸ See the actual payload we captured
            </button>
          </div>
        </div>
        <PlumbingDrawer
          open={open}
          onOpenChange={setOpen}
          getPayload={loader}
        />
      </div>
    </section>
  );
}
