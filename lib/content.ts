import type { CompanyProfile } from "./types";

const CLIENTS = [
  { id: "gainsight", label: "Gainsight" },
  { id: "upside", label: "Upside" },
  { id: "route", label: "Route" },
  { id: "spins", label: "SPINS" },
  { id: "snap", label: "Snap" },
] as const;

const OPPS = [
  { id: "gong", label: "Gong" },
  { id: "clickup", label: "ClickUp" },
  { id: "greenhouse", label: "Greenhouse" },
  { id: "albertsons", label: "Albertsons" },
  { id: "avon", label: "Avon" },
  { id: "starbucks", label: "Starbucks" },
  { id: "vimeo", label: "Vimeo" },
  { id: "dollar-general", label: "Dollar General" },
] as const;

function norm(s: string) {
  return s.toLowerCase();
}

/**
 * Relevance: keyword overlap on industry, company name, and tech.
 */
export function filterRelevantClients(company: CompanyProfile): string[] {
  const blob = norm(
    `${company.industry} ${company.name} ${company.technologies.join(" ")}`
  );
  const score = (name: string) => {
    let s = 0;
    for (const w of name.split(/[^a-z0-9]+/g)) {
      if (w.length > 2 && blob.includes(w)) s += 1;
    }
    if (blob.includes("fintech") && /gainsight|upside|snap|route/.test(name))
      s += 2;
    if (blob.includes("e-comm") || blob.includes("retail")) s += 1;
    if (blob.includes("saas") || blob.includes("b2b")) s += 1;
    return s;
  };
  return [...CLIENTS]
    .sort((a, b) => score(b.label) - score(a.label))
    .map((c) => c.label);
}

export function filterRelevantOpps(company: CompanyProfile): string[] {
  const blob = norm(
    `${company.industry} ${company.name} ${company.technologies.join(" ")}`
  );
  const score = (name: string) => {
    let s = 0;
    for (const w of name.split(/[^a-z0-9]+/g)) {
      if (w.length > 2 && blob.includes(w)) s += 1;
    }
    if (blob.includes("fintech") && /gong|greenhouse|clickup|vimeo/.test(name))
      s += 2;
    if (
      blob.includes("e-comm") ||
      blob.includes("retail") ||
      blob.includes("dtc")
    ) {
      if (/avon|albertsons|starbucks|dollar|dollar general/.test(name)) s += 2;
    }
    if (blob.includes("b2b") && /gong|clickup|vimeo|greenhouse/.test(name))
      s += 1;
    return s;
  };
  return [...OPPS]
    .sort((a, b) => score(b.label) - score(a.label))
    .map((c) => c.label);
}

export const clientLogos = CLIENTS.map((c) => ({ ...c, file: `${c.id}.svg` }));
export const oppLogos = OPPS.map((c) => ({ ...c, file: `${c.id}.svg` }));
