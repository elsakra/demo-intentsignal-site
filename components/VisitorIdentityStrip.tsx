"use client";

import { CompanyMark } from "@/components/CompanyMark";
import type { CompanyProfile, EnrichmentSource, PersonProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { monogramFromName } from "@/lib/companyLogo";

function personInitials(p: PersonProfile | null): string {
  if (!p) return "";
  const a = (p.firstName?.trim() ?? "")[0] ?? "";
  const b = (p.lastName?.trim() ?? "")[0] ?? (p.firstName && p.lastName == null
    ? p.firstName[1]
    : "") ?? "";
  const t = (a + b).toUpperCase();
  if (t) return t;
  if (p.firstName?.length) return p.firstName.slice(0, 2).toUpperCase();
  return "";
}

const sourcePill: Record<EnrichmentSource, string> = {
  ip: "Enriched (IP)",
  rb2b: "Enriched (identity)",
  demo: "Curated demo",
  simulated: "Simulated",
};

type Props = {
  company: CompanyProfile;
  person: PersonProfile | null;
  source: EnrichmentSource | undefined;
  /** When false, do not show "Simulated" (internal demos still look "live"). */
  isAdmin: boolean;
};

/**
 * “Wow” bar: company mark, name, size, role, tech, source pill.
 */
export function VisitorIdentityStrip({ company, person, source = "ip", isAdmin }: Props) {
  const showSource: EnrichmentSource = source;
  const pillRaw = sourcePill[showSource] ?? sourcePill.ip;
  const pill =
    !isAdmin && showSource === "simulated" ? "Live visit" : pillRaw;
  const initials = personInitials(person);
  const em = company.employees;
  const sizeLabel =
    em == null
      ? "Size unknown"
      : em < 200
        ? "SMB"
        : em < 2_000
          ? "Mid-market"
          : "Enterprise+";

  return (
    <div className="mt-6 border border-ink bg-white p-4 md:flex md:items-stretch md:gap-5 md:p-5">
      <div className="flex gap-4">
        <CompanyMark
          domain={company.domain}
          name={company.name}
          size="lg"
          className="self-start"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h2 className="font-display text-lg font-medium tracking-[-0.02em] text-ink md:text-xl">
              {company.name}
            </h2>
            <span className="font-mono text-[10px] text-mute">{company.industry}</span>
            <span className="font-mono text-[10px] text-mute">· {sizeLabel}</span>
            {em != null && (
              <span className="font-mono text-[10px] text-mute">
                · ~{em.toLocaleString()} employees
              </span>
            )}
          </div>
          {person && (person.firstName || person.title) && (
            <div className="mt-3 flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-ink bg-cream font-mono text-xs font-medium text-ink-3"
                aria-hidden
              >
                {initials || (person.firstName
                  ? monogramFromName(person.firstName)
                  : "•")}
              </div>
              <p className="min-w-0 text-sm text-ink [text-wrap:balance]">
                {person.firstName}
                {person.lastName
                  ? ` ${person.lastName}`.trim()
                  : ""}
                {person.title && (
                  <span className="text-mute"> — {person.title}</span>
                )}
                {person.email && (
                  <span className="ml-1 font-mono text-[11px] text-mute">
                    ({person.email})
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-1 flex-col justify-between border-t border-line pt-4 md:mt-0 md:border-l md:border-t-0 md:pl-5 md:pt-0">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-mute">
            Stack
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {company.technologies.length ? (
              company.technologies.slice(0, 6).map((t) => (
                <li
                  key={t}
                  className="border border-line bg-cream px-2 py-0.5 font-mono text-[10px] text-ink"
                >
                  {t}
                </li>
              ))
            ) : (
              <li className="text-sm text-mute">—</li>
            )}
          </ul>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
          <span
            className={cn(
              "font-mono text-[9px] font-medium uppercase tracking-wider",
              showSource === "simulated" && isAdmin && "text-signal",
              showSource === "demo" && "text-ink"
            )}
          >
            {pill}
          </span>
          <span className="max-w-[11rem] text-right font-mono text-[9px] leading-snug text-mute [text-wrap:balance]">
            Profile and marks load on this page only. Not a third-party ad graph.
          </span>
        </div>
      </div>
    </div>
  );
}
