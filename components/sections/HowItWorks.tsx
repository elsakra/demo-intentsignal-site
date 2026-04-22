"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { PlumbingDrawer } from "@/components/narrator/PlumbingDrawer";

const nodes = [
  { k: "Browser", v: "Page view + 1P cookie", t: "t = 0ms" },
  { k: "RB2B", v: "Partner identity pixel", t: "t = 50–180ms" },
  { k: "Vercel Edge", v: "Middleware + headers", t: "t = 20–60ms" },
  { k: "IPinfo", v: "IP → org (Lite API)", t: "t = 80–200ms" },
  { k: "Claude", v: "Sonnet · JSON copy", t: "t = 0.8–1.4s" },
  { k: "SSE", v: "Stream to browser", t: "t = 1.2s+ " },
  { k: "Slack", v: "Webhook (optional)", t: "async" },
  { k: "SDR", v: "Human in loop", t: "—" },
] as const;

function usePipelineElapsed() {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const id = window.setInterval(() => {
      setSec((performance.now() - t0) / 1000);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return sec;
}

function formatAgo(s: number): string {
  if (s < 60) return `${Math.max(0, Math.floor(s))}s ago`;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}m ${r}s ago`;
}

type Payload = Record<string, unknown>;

function PipelineVisualMosaic() {
  return (
    <div className="mt-6 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin]">
      <div className="min-w-[200px] shrink-0 rounded border border-white/10 bg-[#1a1916] p-3 text-[10px] text-[#a8a49a]">
        <div className="mb-1 font-mono text-signal/90">Slack · #gtm-signals</div>
        <div className="rounded border border-white/5 bg-[#0e0e0e] p-2 text-[#d6d1bf]">
          <b className="text-white">New identified visitor</b>
          <br />
          <span className="text-[#7a7770]">Acme Co · 340ms resolve</span>
        </div>
      </div>
      <div className="min-w-[200px] shrink-0 rounded border border-white/10 bg-[#1a1916] p-3 text-[10px] text-[#a8a49a]">
        <div className="mb-1 font-mono text-signal/90">Claude · system</div>
        <div className="max-h-24 overflow-hidden rounded border border-white/5 bg-[#0e0e0e] p-2 font-mono text-[8px] leading-tight text-[#9ae6b4]">
          Output JSON only. GTM engineering agency. No fluff.
        </div>
      </div>
      <div className="min-w-[200px] shrink-0 rounded border border-white/10 bg-[#1a1916] p-3 text-[10px] text-[#a8a49a]">
        <div className="mb-1 font-mono text-signal/90">Record · SFDC (mock)</div>
        <div className="space-y-1 rounded border border-white/5 bg-[#0e0e0e] p-2 text-[#d6d1bf]">
          <div>Account · {`{{company}}`}</div>
          <div className="text-[#6a6761]">Enriched · last visit</div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks({
  getPayload,
}: {
  getPayload: () => Promise<Payload> | Payload;
}) {
  const [open, setOpen] = useState(false);
  const loader = useCallback(() => {
    return getPayload();
  }, [getPayload]);
  const s = usePipelineElapsed();
  const ago = useMemo(() => formatAgo(34 + s), [s]);

  return (
    <section
      id="approach"
      className="section-dark scroll-mt-20 border-b border-white/10 py-20 md:py-24"
    >
      <div className="mx-auto max-w-content px-6 md:px-[72px]">
        <div className="mb-8 grid items-baseline gap-2 md:grid-cols-[120px_1fr] md:gap-12">
          <span className="font-mono text-sm text-signal">08 / 12</span>
          <div>
            <h2 className="font-display text-[2.5rem] leading-tight tracking-[-0.02em] text-cream md:text-[2.75rem]">
              We ran this pipeline on you {ago}
            </h2>
            <p className="mt-2 max-w-[56ch] text-sm leading-[1.4] text-[#a8a49a] [text-wrap:balance]">
              Browser → RB2B → Vercel edge → IPinfo → Claude → SSE to this tab. No
              third-party ad graph crawl — named APIs only. The copy you read was
              generated from org + person fields we already hold.
            </p>
          </div>
        </div>
        <PipelineVisualMosaic />
        <div className="arch mt-8 overflow-hidden border border-white/10 bg-panel px-4 py-7 text-[#D6D1BF] sm:px-7">
          <div className="arch-row flex min-h-[7rem] items-stretch gap-0 overflow-x-auto pb-2">
            {nodes.map((n, i) => (
              <div key={n.k} className="flex min-w-0 items-center">
                {i > 0 && (
                  <div className="arch-link flex w-7 shrink-0 items-center justify-center text-[9px] text-[#6A6761] sm:w-9">
                    <span className="relative z-[1] bg-panel px-0.5">→</span>
                  </div>
                )}
                <div className="arch-node min-w-[120px] border border-[#2a2925] bg-[#141311] p-3 text-[12px] sm:min-w-[130px]">
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
              Every box above is part of the same path that ran for{" "}
              <span className="text-signal">this</span> visit.
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-fit border border-[#4a4740] px-2.5 py-1.5 text-left text-[11px] text-[#E9E3D4] transition-colors hover:border-signal/50"
            >
              See the full trace for your visit →
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
