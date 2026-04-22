import type { CompanyProfile, PersonProfile, StoredIdentity } from "./types";
import { archetypeIds, type ArchetypeId } from "./archetypes";
import { b64uDecode } from "./identity-b64";

export const IDENTITY_HEADER_TECH_CAP = 6;

/** Minimal view passed in headers to avoid exceeding size limits. */
export type IdentityHeaderPayload = {
  v: number;
  visitorId: string;
  hasPerson: boolean;
  company: {
    name: string;
    industry: string;
    employees: number | null;
    domain?: string;
    technologies: string[];
  };
  person: {
    firstName: string | null;
    lastName: string | null;
    title: string | null;
    email: string | null;
  } | null;
  archetype: ArchetypeId;
  source: StoredIdentity["source"];
};

function capTechnologies(tech: string[] | undefined): string[] {
  if (!Array.isArray(tech)) return [];
  return tech
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean)
    .slice(0, IDENTITY_HEADER_TECH_CAP);
}

export function identityToHeaderPayload(
  id: StoredIdentity
): IdentityHeaderPayload {
  return {
    v: id.version,
    visitorId: id.visitorId,
    hasPerson: id.hasPerson,
    company: {
      name: id.company.name,
      industry: id.company.industry,
      employees: id.company.employees,
      domain: id.company.domain,
      technologies: capTechnologies(id.company.technologies),
    },
    person: id.person
      ? {
          firstName: id.person.firstName,
          lastName: id.person.lastName,
          title: id.person.title,
          email: id.person.email,
        }
      : null,
    archetype: id.archetype,
    source: id.source,
  };
}

function normalizePayload(
  j: unknown
): IdentityHeaderPayload | null {
  if (typeof j !== "object" || j === null) return null;
  const o = j as Record<string, unknown>;
  const company = o.company;
  if (typeof company !== "object" || company === null) return null;
  const c = company as Record<string, unknown>;
  const name = typeof c.name === "string" ? c.name : "Visitor";
  const industry = typeof c.industry === "string" ? c.industry : "B2B SaaS";
  const employees =
    typeof c.employees === "number" || c.employees === null
      ? c.employees
      : null;
  const domain = typeof c.domain === "string" ? c.domain : undefined;
  const technologies = capTechnologies(
    Array.isArray(c.technologies) ? (c.technologies as string[]) : undefined
  );
  const p = o.person;
  const person =
    p && typeof p === "object" && p !== null
      ? {
          firstName: typeof (p as { firstName?: unknown }).firstName === "string"
            ? (p as { firstName: string | null }).firstName
            : null,
          lastName: typeof (p as { lastName?: unknown }).lastName === "string"
            ? (p as { lastName: string | null }).lastName
            : null,
          title: typeof (p as { title?: unknown }).title === "string"
            ? (p as { title: string | null }).title
            : null,
          email: typeof (p as { email?: unknown }).email === "string"
            ? (p as { email: string | null }).email
            : null,
        }
      : null;
  const arch = typeof o.archetype === "string" && (archetypeIds as readonly string[]).includes(o.archetype)
    ? (o.archetype as ArchetypeId)
    : "b2b-saas-midmarket";
  const sourceRaw = o.source;
  const source: StoredIdentity["source"] =
    sourceRaw === "ip" || sourceRaw === "rb2b" || sourceRaw === "demo" || sourceRaw === "simulated"
      ? sourceRaw
      : "ip";
  return {
    v: typeof o.v === "number" ? o.v : 0,
    visitorId: typeof o.visitorId === "string" ? o.visitorId : "",
    hasPerson: Boolean(o.hasPerson),
    company: {
      name,
      industry,
      employees: employees as number | null,
      ...(domain ? { domain } : {}),
      technologies,
    },
    person,
    archetype: arch,
    source,
  };
}

function decode(
  b64: string | null | undefined
): IdentityHeaderPayload | null {
  if (!b64) return null;
  try {
    const j = JSON.parse(b64uDecode(b64)) as unknown;
    return normalizePayload(j);
  } catch {
    return null;
  }
}

export { decode as parseIdentityFromHeaderBase64url };

export function toCompanyProfileFromHeader(
  h: IdentityHeaderPayload | null,
  full?: CompanyProfile | null
): CompanyProfile {
  if (full) return full;
  if (!h) {
    return {
      name: "Visitor",
      industry: "B2B SaaS",
      employees: null,
      technologies: [],
      recentNews: "none",
    };
  }
  return {
    name: h.company.name,
    industry: h.company.industry,
    employees: h.company.employees,
    ...(h.company.domain ? { domain: h.company.domain } : {}),
    technologies: h.company.technologies?.length
      ? [...h.company.technologies]
      : [],
    recentNews: "none",
  };
}

export const toCompanyFromHeader = toCompanyProfileFromHeader;

export function toPersonFromHeader(
  h: IdentityHeaderPayload | null
): PersonProfile | null {
  if (!h?.person) return null;
  return {
    firstName: h.person.firstName,
    lastName: h.person.lastName,
    title: h.person.title,
    email: h.person.email,
  };
}
