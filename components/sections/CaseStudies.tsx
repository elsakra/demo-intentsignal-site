"use client";

import { motion } from "framer-motion";
import type { CompanyProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

const all = [
  {
    id: "upside",
    order: 0,
    logo: "Upside",
    tag: { kind: "matched" as const, t: "Matched · fintech" },
    num: "4.1×",
    sub: "pipeline · same headcount · 6 months",
    body: "Their outbound was a hand-built tangle: Apollo, Clay, Smartlead, four Google Sheets. We rebuilt it as one system with scoring, auto-routing, and sequences keyed to real-time intent. They got pipeline back in six weeks and stopped hiring SDRs to cover the gap.",
    quote:
      "They rebuilt our outbound in six weeks. We stopped hiring more SDRs.",
    by: "VP Demand · Upside",
  },
  {
    id: "gainsight",
    order: 1,
    logo: "Gainsight",
    tag: { kind: "ghost" as const, t: "Case 02" },
    num: "90s",
    sub: "SDR research time · down from 22 min",
    body: "SDRs spent a third of their day tab-stacking research. We shipped a copilot that reads CRM, call history, and public signals, then writes the opener. It is the first AI workflow their SDRs run without a mandate.",
    quote:
      "It is the first AI tool our SDRs actually use without being told to.",
    by: "Director of SDR · Gainsight",
  },
  {
    id: "route",
    order: 2,
    logo: "Route",
    tag: { kind: "ghost" as const, t: "Case 03" },
    num: "3.2×",
    sub: "lower CPL · 2.8× MQL→SQL · 2Q",
    body: "Paid was leaking. We rebuilt LinkedIn and Meta from first-party site intent and shipped per-visit landing pages. They replaced the previous agency and bought a focused build from us instead.",
    quote: "We fired our agency and bought a weekend of their time instead.",
    by: "CMO · Route",
  },
] as const;

function orderFor(company: CompanyProfile | null) {
  if (!company) return [0, 1, 2];
  if (/fintech|bank|lending|payment/.test(company.industry.toLowerCase()))
    return [0, 1, 2];
  if (/e-?comm|retail|dtc|commerce/.test(company.industry.toLowerCase()))
    return [2, 0, 1];
  return [0, 1, 2];
}

type Props = { company: CompanyProfile | null };

export function CaseStudies({ company }: Props) {
  const ord = orderFor(company);
  const items = ord.map((i) => all[i]!);
  return (
    <section id="work" className="scroll-mt-20 border-b border-line bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-content px-6 md:px-[72px]">
        <div className="mb-10 grid items-baseline gap-2 md:grid-cols-[120px_1fr] md:gap-12">
          <span className="font-mono text-sm text-signal">09 / 12</span>
          <h2 className="font-display text-[2.5rem] leading-tight tracking-[-0.02em] text-ink md:text-[2.75rem]">
            Cases, proof, receipts
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
          {items.map((c, i) => (
            <motion.article
              key={c.id}
              layout
              className={cn(
                "flex min-h-[360px] flex-col border border-line bg-white p-5",
                c.tag.kind === "matched" && "border-ink bg-cream-2"
              )}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.2, 0.9, 0.2, 1] }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-[22px] font-medium leading-none tracking-[-0.01em]">
                  {c.logo}
                </span>
                {c.tag.kind === "matched" ? (
                  <span className="bg-signal px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                    {c.tag.t}
                  </span>
                ) : (
                  <span className="border border-dashed border-mute px-1.5 py-0.5 font-mono text-[10px] text-mute">
                    {c.tag.t}
                  </span>
                )}
              </div>
              <div className="font-display text-[3.2rem] font-light leading-none tracking-[-0.04em] text-ink sm:text-[4.2rem]">
                {c.num}
                <sub className="ml-0.5 block font-mono text-[10px] font-normal uppercase tracking-wider text-mute sm:text-[11px]">
                  {c.sub}
                </sub>
              </div>
              <p className="prose-tight mt-3 text-[15px]">
                {c.body}
              </p>
              <p className="mt-auto border-t border-dashed border-line pt-3 font-display text-sm italic leading-relaxed text-ink-3">
                {c.quote}
                <span className="not-italic mt-1.5 block font-mono text-[9px] uppercase tracking-widest text-mute">
                  {c.by}
                </span>
              </p>
              <a
                href="#book"
                className="mt-3 font-mono text-[10px] text-signal hover:underline"
              >
                read the build →
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
