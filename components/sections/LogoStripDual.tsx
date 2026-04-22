"use client";

import { motion } from "framer-motion";
import { clientLogos, filterRelevantOpps, OPPS } from "@/lib/content";
import { CompanyMark } from "@/components/CompanyMark";
import type { CompanyProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { type Archetype } from "@/lib/archetypes";

const oppList = OPPS;

type Props = {
  company: CompanyProfile | null;
  archetype: Archetype;
};

export function LogoStripDual({ company, archetype }: Props) {
  const opOrder = company
    ? filterRelevantOpps(company)
    : oppList.map((o) => o.label);
  const top4 = new Set(opOrder.slice(0, 4));
  return (
    <div className="logostrip max-w-content border border-ink bg-white">
      <div className="row grid min-h-0 border-b border-line sm:grid-cols-[200px_1fr]">
        <div className="lab border-ink p-4 font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-mute sm:border-r">
          <b className="text-ink">Our clients</b>
          <br />
          Companies who hired us
        </div>
        <div className="logos flex flex-wrap items-center gap-7 p-4 md:gap-9">
          {clientLogos.map((c) => (
            <div
              key={c.id}
              className="flex h-7 min-w-0 max-w-[120px] items-center"
              title={c.label}
            >
              <CompanyMark
                domain={c.domain}
                name={c.label}
                size="md"
                variant="bar"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="row grid min-h-0 sm:grid-cols-[200px_1fr]">
        <div className="lab border-ink p-4 font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-mute sm:border-r">
          <b className="text-ink">Recent opps created</b>
          <br />
          Meetings booked for clients
        </div>
        <div className="logos flex flex-wrap items-center gap-6 p-4 md:gap-8">
          {oppList.map((o) => {
            const hit = top4.has(o.label);
            return (
              <motion.div
                key={o.id}
                className="inline-flex items-center gap-2"
                initial={false}
                animate={{ opacity: hit ? 1 : 0.4 }}
                transition={{ duration: 0.4 }}
              >
                <CompanyMark
                  domain={o.domain}
                  name={o.label}
                  size="sm"
                  className={cn(
                    "border-ink/20",
                    hit && "ring-1 ring-signal/40"
                  )}
                />
                <span
                  className={cn(
                    "font-display text-[16px] font-medium leading-none tracking-[-0.01em] text-ink sm:text-[18px]",
                    hit && "border-b border-signal pb-0.5"
                  )}
                >
                  {o.label}
                </span>
              </motion.div>
            );
          })}
          <span className="ml-auto inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-signal">
              matched · {archetype.label}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
