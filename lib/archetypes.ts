type CompanyLike = {
  name: string;
  industry: string;
  employees: number | null;
  technologies: string[];
};

export const archetypeIds = [
  "b2b-saas-smb",
  "b2b-saas-midmarket",
  "b2b-saas-enterprise",
  "ecomm-dtc",
  "fintech",
  "services-agency",
] as const;

export type ArchetypeId = (typeof archetypeIds)[number];

export type Archetype = {
  id: ArchetypeId;
  label: string;
  hero_h1: string;
  subhead: string;
  cta: string;
};

const archetypes: Record<ArchetypeId, Archetype> = {
  "b2b-saas-smb": {
    id: "b2b-saas-smb",
    label: "B2B SaaS · SMB",
    hero_h1: "Your GTM stack is *leaking pipeline.*\nWe build the plumbing that stops it.",
    subhead:
      "IntentSignal is a GTM engineering agency for lean B2B teams. Cold outbound, paid social, and intent data—shipped as working systems, not decks.",
    cta: "See what we would build for you",
  },
  "b2b-saas-midmarket": {
    id: "b2b-saas-midmarket",
    label: "B2B SaaS · mid-market",
    hero_h1: "You outgrew the *playbook* before RevOps outgrew the spreadsheet.",
    subhead:
      "We build outbound, paid, and on-site ID pipelines for mid-market SaaS the same way we would in-house: instrumented, testable, owner-operated.",
    cta: "Book a teardown call",
  },
  "b2b-saas-enterprise": {
    id: "b2b-saas-enterprise",
    label: "B2B SaaS · enterprise",
    hero_h1: "Enterprise *GTM* does not need another vendor.\nIt needs engineering.",
    subhead:
      "Security review–friendly work: custom routing, data contracts, and AI copilots that sit behind your IdP, not a login wall.",
    cta: "Scope the first 30 days",
  },
  "ecomm-dtc": {
    id: "ecomm-dtc",
    label: "E‑commerce · DTC",
    hero_h1: "Your *paid* efficiency is a first-party data problem, not a creative one.",
    subhead:
      "We connect real sessions to audiences and to landing pages that change per click—so Meta and LinkedIn stop guessing who is actually on the site.",
    cta: "Show me a rebuild plan",
  },
  fintech: {
    id: "fintech",
    label: "Fintech",
    hero_h1: "The *handoff* between systems is where fintech GTM always leaks.",
    subhead:
      "We have shipped identity, routing, and scoring layers for growth-stage and late-stage fintechs—treat us like a two-person GTM eng team, not a deck shop.",
    cta: "Book a teardown call",
  },
  "services-agency": {
    id: "services-agency",
    label: "Services · agency",
    hero_h1: "Agency *margins* sit in ops: routing, resourcing, and data.",
    subhead:
      "We help services firms wire CRM, ad platforms, and delivery systems so the pipeline matches how your team really sells and staffs.",
    cta: "Map one broken route",
  },
};

const GENERIC: ArchetypeId = "b2b-saas-midmarket";

function industryTokens(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);
}

export function pickArchetype(company: CompanyLike | null): Archetype {
  if (!company?.name) return archetypes[GENERIC];
  const ind = company.industry.toLowerCase();
  const name = company.name.toLowerCase();
  const t = (company.technologies || []).map((x) => x.toLowerCase());
  if (
    /e-?comm|retail|dtc|consumer brand|omni/.test(ind) ||
    /e-?comm|retail|dtc|shop|store/.test(name)
  ) {
    return archetypes["ecomm-dtc"];
  }
  if (/fintech|bank|payments|lending|wealth|trading|crypto/.test(ind + name)) {
    return archetypes.fintech;
  }
  if (
    /agenc|services|consult|staffing|dev shop|system integrator/.test(ind + name)
  ) {
    return archetypes["services-agency"];
  }
  const n = company.employees;
  if (n != null) {
    if (n < 200) return archetypes["b2b-saas-smb"];
    if (n < 2000) return archetypes["b2b-saas-midmarket"];
    return archetypes["b2b-saas-enterprise"];
  }
  const tokens = new Set([...industryTokens(ind), ...t]);
  if (tokens.has("shopify") || /commerce/.test(ind)) {
    return archetypes["ecomm-dtc"];
  }
  return archetypes[GENERIC];
}

export function getArchetypeById(id: ArchetypeId | string | undefined): Archetype {
  if (id && id in archetypes) return archetypes[id as ArchetypeId];
  return archetypes[GENERIC];
}
