"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    n: "01 / COLD OUTBOUND",
    title: "We build outbound systems that book meetings while you sleep.",
    desc: "Multi-channel sequences on custom data pipelines, deliverability infrastructure, and copy personalized at scale. Not list pulls. Engineered systems.",
    proof: "PROOF",
    proofLine: "→ Opened doors at Gong, ClickUp, and Starbucks for our clients",
    hover: "→ Upside: 12,400 prospects, 87 meetings, 6 opps in 90 days",
    cta: "show me the system →",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="stroke-ink"
        strokeWidth="1.2"
      >
        <path d="M3 7h14l4 4v6H3z" />
        <circle cx="8" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="M3 11h14" strokeDasharray="1.5 1.5" />
      </svg>
    ),
  },
  {
    n: "02 / PAID SOCIAL",
    title: "We run LinkedIn and Meta off your first-party intent data.",
    desc: "Custom audiences from who is on your site, not platform lookalikes. Landing pages that change per visit — you are on one right now.",
    proof: "PROOF",
    proofLine: "→ 3.2× lower CPL for Route vs prior agency",
    hover: "→ Route: audiences rebuilt from on-site ID hourly",
    cta: "show me the system →",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="stroke-ink"
        strokeWidth="1.2"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" className="text-signal" stroke="none" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    ),
  },
  {
    n: "03 / GTM ENGINEERING",
    title: "We write the code between your data and your revenue.",
    desc: "Visitor ID to enrichment to Slack to SDR in one path. Scoring, custom copilots, and pages like this one — all product-owned.",
    proof: "PROOF",
    proofLine: "→ Built the stack for Upside’s outbound motion",
    hover: "→ p95 on-site to Slack: under half a second",
    cta: "show me the system →",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="stroke-ink"
        strokeWidth="1.2"
      >
        <rect x="3" y="4" width="6" height="6" />
        <rect x="15" y="4" width="6" height="6" />
        <rect x="9" y="14" width="6" height="6" />
        <path d="M6 10v2h12v2M12 12v2" />
      </svg>
    ),
  },
  {
    n: "04 / AEO",
    title: "We get your company cited by ChatGPT and Claude.",
    desc: "Search is not the only top of funnel. We ship content and distribution so answer engines name you when buyers ask your category — monitored and refreshed on purpose.",
    proof: "PROOF",
    proofLine: "→ Gainsight: higher citation rate in model answers, Q1 forward",
    hover: "→ Citation list + content cadence in one runbook",
    cta: "show me the system →",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="stroke-ink"
        strokeWidth="1.2"
      >
        <path d="M4 12c4-6 12-6 16 0-4 6-12 6-16 0z" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" className="text-signal" stroke="none" />
        <path d="M12 4v2M12 18v2" />
      </svg>
    ),
  },
] as const;

export function ServicesGrid() {
  const [h, setH] = useState<number | null>(null);
  return (
    <section id="services" className="scroll-mt-20 border-b border-line bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-content px-6 md:px-[72px]">
        <div className="mb-8 grid items-baseline gap-2 md:grid-cols-[120px_1fr] md:gap-12">
          <span className="font-mono text-sm text-signal">07 / 12</span>
          <div>
            <h2 className="font-display text-[2.5rem] leading-tight tracking-[-0.02em] text-ink md:text-[2.75rem]">
              What we ship
            </h2>
            <p className="prose-tight mt-2 max-w-[50ch]">
              Four workstreams. One bar for what &quot;done&quot; means: working systems in
              production, not a roadmap slide.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-px border border-ink/30 bg-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <motion.div
              key={p.n}
              className="group flex min-h-[20rem] flex-col bg-white p-5 sm:min-h-[22rem] lg:min-h-[24rem]"
              onMouseEnter={() => setH(i)}
              onMouseLeave={() => setH(null)}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }}
            >
              <div className="mb-3 grid h-[42px] w-[42px] place-items-center border border-ink">
                {p.icon}
              </div>
              <div className="font-mono text-[10px] font-medium tracking-[0.1em] text-signal">
                {p.n}
              </div>
              <h3 className="mt-2 font-display text-lg font-medium leading-snug tracking-[-0.01em] text-ink md:text-xl [text-wrap:balance]">
                {p.title}
              </h3>
              <p className="prose-tight mt-2 flex-1 text-[15px]">
                {p.desc}
              </p>
              <a
                href="#approach"
                className="mt-2 font-mono text-[10px] text-signal hover:underline"
              >
                {p.cta}
              </a>
              <div className="mt-auto border-t border-dashed border-line pt-3 font-mono text-[10.5px] leading-snug text-ink">
                <span className="text-signal">{p.proof}</span>
                <br />
                <AnimatePresence mode="wait">
                  {h === i ? (
                    <motion.span
                      key="h"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-[10.5px] font-medium"
                    >
                      {p.hover}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="d"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {p.proofLine}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
