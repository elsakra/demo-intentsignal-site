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

/** Fletch-style: category anchor first, named proof, no metaphor-as-headline. */
const archetypes: Record<ArchetypeId, Archetype> = {
  "b2b-saas-smb": {
    id: "b2b-saas-smb",
    label: "B2B SaaS · SMB",
    hero_h1: "The GTM engineering agency for B2B SaaS.",
    subhead:
      "We build outbound systems, paid ABM, and revenue infrastructure for teams your size. Same deliverables we shipped for Gainsight and Route: working code, not decks.",
    cta: "Book a teardown call",
  },
  "b2b-saas-midmarket": {
    id: "b2b-saas-midmarket",
    label: "B2B SaaS · mid-market",
    hero_h1: "The GTM engineering agency for B2B SaaS.",
    subhead:
      "We build the outbound systems, paid ABM campaigns, and custom revenue infrastructure that Gong, Gainsight, and Upside use to hit their numbers. Shipped as working software, not slide decks.",
    cta: "Book a teardown call",
  },
  "b2b-saas-enterprise": {
    id: "b2b-saas-enterprise",
    label: "B2B SaaS · enterprise",
    hero_h1: "GTM engineering for enterprise B2B.",
    subhead:
      "Custom routing, data contracts, and AI tools behind your IdP. We sit next to your RevOps and ship what your vendors describe in roadmaps—except we ship in weeks.",
    cta: "Book a teardown call",
  },
  "ecomm-dtc": {
    id: "ecomm-dtc",
    label: "E‑commerce · DTC",
    hero_h1: "GTM engineering for retail and e‑commerce brands.",
    subhead:
      "We connect real site and app sessions to ad audiences and to landing pages that change per visit. The same first-party + paid stack we run for high-volume retail and DTC clients.",
    cta: "Book a teardown call",
  },
  fintech: {
    id: "fintech",
    label: "Fintech",
    hero_h1: "The GTM engineering agency for fintech GTM orgs.",
    subhead:
      "Identity layers, scoring, and routing for regulated stacks. We have shipped for growth- and late-stage fintechs as an embedded GTM eng team, not a slide shop.",
    cta: "Book a teardown call",
  },
  "services-agency": {
    id: "services-agency",
    label: "Services · agency",
    hero_h1: "GTM engineering for services firms.",
    subhead:
      "We wire CRM, ads, and delivery so pipeline matches how you actually sell and staff. Fewer handoffs, fewer spreadsheets pretending to be a system.",
    cta: "Book a teardown call",
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
