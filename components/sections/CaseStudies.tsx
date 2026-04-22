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
    sub: "pipeline from same headcount · 6 months",
    body: "Outbound motion plateaued, SDRs burning 22 min per account. We built a unified pipeline — scoring, auto-routing, and sequences keyed to intent.",
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
    body: "SDRs spent 30% of their day researching. We put account intel one Slack command away.",
    quote:
      "It is the first AI tool our SDRs actually use without being told.",
    by: "Director of SDR · Gainsight",
  },
  {
    id: "route",
    order: 2,
    logo: "Route",
    tag: { kind: "ghost" as const, t: "Case 03" },
    num: "3.2×",
    sub: "lower CPL · 2.8× MQL→SQL",
    body: "Audiences flattened; paid down two quarters. We rebuilt from first-party sessions + per-click LPs.",
    quote:
      "We fired our agency and bought a weekend of their time instead.",
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
    <section id="work" className="scroll-mt-20 border-b border-line py-20 md:py-28">
      <div className="mx-auto max-w-content px-6 md:px-[72px]">
        <div className="mb-10 grid items-baseline gap-2 md:grid-cols-[120px_1fr] md:gap-12">
          <span className="font-mono text-sm text-signal">09 / 12</span>
          <h2 className="font-display text-[2.5rem] leading-tight tracking-[-0.02em] md:text-[2.75rem]">
            Cases, <em className="font-light not-italic text-signal">proof</em>.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
          {items.map((c, i) => (
            <motion.article
              key={c.id}
              layout
              className={cn(
                "flex min-h-[320px] flex-col border border-line bg-white p-5",
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
                  <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-white bg-signal px-1.5 py-0.5">
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
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">
                {c.body}
              </p>
              <p className="mt-auto border-t border-dashed border-line pt-3 font-display text-sm italic leading-relaxed text-ink-3">
                {c.quote}
                <span className="not-italic mt-1.5 block font-mono text-[9px] uppercase tracking-widest text-mute">
                  {c.by}
                </span>
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
