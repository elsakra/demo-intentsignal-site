"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    n: "01 / COLD OUTBOUND",
    title: "Cold\noutbound",
    desc: "Multi-channel systems that book meetings while you sleep. Custom data pipelines, deliverability infrastructure, Claude-personalized copy at scale. Not list pulls — engineered systems.",
    proof: "PROOF",
    proofLine: "Opened doors at Gong, ClickUp, and Starbucks for our clients",
    hover: "→ For Upside: 12,400 prospects, 87 meetings, 6 opps in 90 days.",
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
    title: "Paid\nsocial",
    desc: "LinkedIn + Meta campaigns powered by first-party intent data. Custom audiences from who is actually on your site, not who Meta thinks looks like them. Landing pages that personalize per click.",
    proof: "PROOF",
    proofLine: "3.2× lower CPL vs agency benchmark for Route",
    hover: "→ Route: meta audiences rebuilt from on-site ID hourly.",
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
    title: "GTM\nengineering",
    desc: "The plumbing between your data and your revenue. Visitor ID → enrichment → Slack → SDR, in 400ms. Claude-powered scoring. Custom RAG copilots. Personalized landing pages — this one, for example.",
    proof: "PROOF",
    proofLine: "Built the stack powering Upside’s outbound motion",
    hover: "→ On-site to Slack: under half a second p95.",
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
    title: "Answer engine\noptimization",
    desc: "Your buyers ask ChatGPT and Claude now. We engineer content and distribution so answer engines cite you when your category gets asked. Monitoring, content, citation-driven distribution.",
    proof: "PROOF",
    proofLine: "Gainsight mentioned in 34% more model answers since Q1",
    hover: "→ Citation coverage + refresh cadence under one runbook.",
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
    <section id="services" className="scroll-mt-20 border-b border-line py-20 md:py-28">
      <div className="mx-auto max-w-content px-6 md:px-[72px]">
        <div className="mb-8 grid items-baseline gap-2 md:grid-cols-[120px_1fr] md:gap-12">
          <span className="font-mono text-sm text-signal">07 / 12</span>
          <div>
            <h2 className="font-display text-[2.5rem] leading-tight tracking-[-0.02em] text-ink md:text-[2.75rem]">
              Four pillars, <em className="font-light not-italic text-signal">one grid</em>.
            </h2>
            <p className="mt-2 max-w-[45ch] text-ink-3">Equal columns, equal rigor, no “strategy track.”</p>
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
              <h3 className="mt-2 whitespace-pre-line font-display text-2xl font-medium leading-tight tracking-[-0.01em]">
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-3">
                {p.desc}
              </p>
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
