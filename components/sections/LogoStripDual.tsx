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

/**
 * "Recent opps" row first and visually larger (proof hierarchy).
 */
export function LogoStripDual({ company, archetype }: Props) {
  const opOrder = company
    ? filterRelevantOpps(company)
    : oppList.map((o) => o.label);
  const top4 = new Set(opOrder.slice(0, 4));
  return (
    <div className="logostrip max-w-content border border-ink bg-white">
      <div className="row grid min-h-0 border-b border-line sm:grid-cols-[220px_1fr]">
        <div className="lab border-ink p-4 font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-mute sm:border-r sm:py-5">
          <b className="text-ink">Recent opps for clients</b>
          <br />
          <span className="text-[9px] font-normal normal-case text-mute [text-wrap:balance]">
            Companies our clients open doors with (illustrative mix, last 90 days)
          </span>
        </div>
        <div className="logos flex flex-col gap-2 p-4 pt-5 md:gap-3 md:p-5">
          <div className="flex flex-wrap items-center gap-5 md:gap-8">
            {oppList.map((o) => {
              const hit = top4.has(o.label);
              return (
                <motion.div
                  key={o.id}
                  className="inline-flex items-center gap-2.5"
                  initial={false}
                  animate={{ opacity: hit ? 1 : 0.4 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="h-10 w-auto max-w-[128px]">
                    <CompanyMark
                      domain={o.domain}
                      name={o.label}
                      size="md"
                      variant="bar"
                      className="!h-10 !max-h-10 !w-auto !max-w-[128px] border-ink/10"
                    />
                  </div>
                  <span
                    className={cn(
                      "font-display text-[17px] font-medium leading-none tracking-[-0.01em] text-ink sm:text-[20px]",
                      hit && "border-b border-signal pb-0.5"
                    )}
                  >
                    {o.label}
                  </span>
                </motion.div>
              );
            })}
            <span className="ml-auto inline-flex items-center gap-1.5 self-center">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-signal">
                matched · {archetype.label}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="row grid min-h-0 sm:grid-cols-[220px_1fr]">
        <div className="lab border-ink bg-cream-2/50 p-3 font-mono text-[9px] uppercase leading-snug tracking-[0.14em] text-mute/90 sm:border-r sm:py-4">
          <b className="text-ink/80">Our clients</b>
          <br />
          Who hired us
        </div>
        <div className="logos flex flex-wrap items-center gap-5 bg-cream-2/30 p-3 opacity-90 md:gap-6 md:py-4 md:pl-4">
          {clientLogos.map((c) => (
            <div
              key={c.id}
              className="flex h-6 min-w-0 max-w-[100px] items-center"
              title={c.label}
            >
              <CompanyMark
                domain={c.domain}
                name={c.label}
                size="sm"
                variant="bar"
                className="!h-6"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
