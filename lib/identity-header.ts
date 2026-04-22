import type { CompanyProfile, PersonProfile, StoredIdentity } from "./types";
import type { ArchetypeId } from "./archetypes";
import { b64uDecode } from "./identity-b64";

/** Minimal view passed in headers to avoid exceeding size limits. */
export type IdentityHeaderPayload = {
  v: number;
  visitorId: string;
  hasPerson: boolean;
  company: {
    name: string;
    industry: string;
    employees: number | null;
  };
  person: {
    firstName: string | null;
    lastName: string | null;
    title: string | null;
  } | null;
  archetype: ArchetypeId;
  source: StoredIdentity["source"];
};

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
    },
    person: id.person
      ? {
          firstName: id.person.firstName,
          lastName: id.person.lastName,
          title: id.person.title,
        }
      : null,
    archetype: id.archetype,
    source: id.source,
  };
}

function decode(
  b64: string | null | undefined
): IdentityHeaderPayload | null {
  if (!b64) return null;
  try {
    const j = JSON.parse(b64uDecode(b64)) as unknown;
    if (typeof j !== "object" || j === null) return null;
    return j as IdentityHeaderPayload;
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
    technologies: [],
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
    email: null,
  };
}
