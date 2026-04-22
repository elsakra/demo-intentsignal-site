"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { clientLogos, filterRelevantOpps } from "@/lib/content";
import type { CompanyProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { type Archetype } from "@/lib/archetypes";

const oppList = [
  { id: "gong", label: "Gong" },
  { id: "clickup", label: "ClickUp" },
  { id: "greenhouse", label: "Greenhouse" },
  { id: "vimeo", label: "Vimeo" },
  { id: "avon", label: "Avon" },
  { id: "albertsons", label: "Albertsons" },
  { id: "starbucks", label: "Starbucks" },
  { id: "dollar-general", label: "Dollar General" },
] as const;

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
            <Image
              key={c.id}
              src={`/logos/${c.file}`}
              alt=""
              width={100}
              height={28}
              className="h-7 w-auto"
            />
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
                className="inline-block"
                initial={false}
                animate={{ opacity: hit ? 1 : 0.4 }}
                transition={{ duration: 0.4 }}
              >
                <span
                  className={cn(
                    "font-display text-[22px] font-medium tracking-[-0.01em] text-ink",
                    hit && "border-b border-signal pb-1"
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
