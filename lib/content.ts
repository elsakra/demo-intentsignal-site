import type { CompanyProfile } from "./types";

const CLIENTS = [
  { id: "gainsight", label: "Gainsight", domain: "gainsight.com" },
  { id: "upside", label: "Upside", domain: "upside.com" },
  { id: "route", label: "Route", domain: "route.com" },
  { id: "spins", label: "SPINS", domain: "spins.com" },
  { id: "snap", label: "Snap", domain: "snap.com" },
] as const;

const OPPS = [
  { id: "gong", label: "Gong", domain: "gong.io" },
  { id: "clickup", label: "ClickUp", domain: "clickup.com" },
  { id: "greenhouse", label: "Greenhouse", domain: "greenhouse.com" },
  { id: "albertsons", label: "Albertsons", domain: "albertsons.com" },
  { id: "avon", label: "Avon", domain: "avon.com" },
  { id: "starbucks", label: "Starbucks", domain: "starbucks.com" },
  { id: "vimeo", label: "Vimeo", domain: "vimeo.com" },
  { id: "dollar-general", label: "Dollar General", domain: "dollargeneral.com" },
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
export { OPPS, CLIENTS };
