import { z } from "zod";
import { b64uDecode, b64uEncode } from "./identity-b64";
import { pickArchetype } from "./archetypes";
import type { CompanyProfile, PersonProfile, StoredIdentity } from "./types";
import { IDENTITY_HEADER_TECH_CAP } from "./identity-header";

const MAX_DECODED_BYTES = 2_500;
const STR_MAX = 200;

const playSchemaV1 = z.object({
  v: z.literal(1),
  name: z.string().max(STR_MAX).min(1),
  domain: z.string().max(STR_MAX).optional(),
  industry: z.string().max(STR_MAX).default("B2B SaaS"),
  employees: z.number().int().min(0).max(2_000_000).nullish(),
  technologies: z.array(z.string().max(48)).max(IDENTITY_HEADER_TECH_CAP).optional(),
  recentNews: z.string().max(1_200).nullable().optional(),
  firstName: z.string().max(80).nullable().optional(),
  lastName: z.string().max(80).nullable().optional(),
  title: z.string().max(120).nullable().optional(),
  email: z.string().max(200).nullable().optional(),
});

export type PlayPayloadV1 = z.infer<typeof playSchemaV1>;

function normDomain(s: string | undefined): string | undefined {
  if (!s) return undefined;
  const t0 = s.trim().toLowerCase().replace(/^https?:\/\//, "");
  const t = t0.split("/")[0]!.replace(/^www\./, "");
  if (t.length < 4 || !t.includes(".")) return undefined;
  if (!/^[a-z0-9]/.test(t) || !/[a-z0-9]$/i.test(t)) return undefined;
  return t;
}

/**
 * Build StoredIdentity from validated ?play= payload (source: simulated).
 */
export function playPayloadToStored(
  p: PlayPayloadV1,
  visitorId: string
): StoredIdentity {
  const domain = normDomain(p.domain);
  const company: CompanyProfile = {
    name: p.name.trim().slice(0, STR_MAX),
    ...(domain ? { domain } : {}),
    industry: p.industry.trim() || "B2B SaaS",
    employees: p.employees ?? null,
    technologies: (p.technologies ?? [])
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, IDENTITY_HEADER_TECH_CAP),
    recentNews: p.recentNews?.trim() ?? "none",
  };
  const hasAnyPerson =
    [p.firstName, p.lastName, p.title, p.email].some(
      (x) => x != null && String(x).length > 0
    );
  const person: PersonProfile | null = hasAnyPerson
    ? {
        firstName: p.firstName?.trim() ?? null,
        lastName: p.lastName?.trim() ?? null,
        title: p.title?.trim() ?? null,
        email: p.email?.trim() ? p.email.trim().slice(0, 200) : null,
      }
    : null;
  const arch = pickArchetype(company);
  return {
    version: 1,
    visitorId,
    company,
    person,
    source: "simulated",
    updatedAt: new Date().toISOString(),
    archetype: arch.id,
    hasPerson: person != null,
  };
}

/**
 * Parse ?play= (base64url JSON). Returns null if invalid.
 */
export function parsePlayParam(
  raw: string | null | undefined,
  visitorId: string
): StoredIdentity | null {
  if (!raw || raw.length > 12_000) return null;
  let decoded: string;
  try {
    decoded = b64uDecode(raw);
  } catch {
    return null;
  }
  if (new TextEncoder().encode(decoded).length > MAX_DECODED_BYTES) {
    return null;
  }
  let o: unknown;
  try {
    o = JSON.parse(decoded) as unknown;
  } catch {
    return null;
  }
  const p = playSchemaV1.safeParse(o);
  if (!p.success) return null;
  return playPayloadToStored(p.data, visitorId);
}

/**
 * Build shareable `play` query value from a form-like object.
 */
export function encodePlayPayload(input: {
  name: string;
  domain?: string;
  industry: string;
  employees: string | number | null;
  technologies: string;
  recentNews: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
}): string | null {
  const tech = input.technologies
    .split(/[,;\n]+/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, IDENTITY_HEADER_TECH_CAP);
  let employees: number | null | undefined = undefined;
  if (String(input.employees).trim() !== "") {
    const n = Number(String(input.employees).replace(/,/g, ""));
    if (!Number.isFinite(n) || n < 0) return null;
    employees = Math.min(Math.floor(n), 2_000_000);
  } else {
    employees = null;
  }
  const v1: PlayPayloadV1 = {
    v: 1,
    name: input.name.trim().slice(0, STR_MAX),
    domain: input.domain?.trim() || undefined,
    industry: input.industry.trim().slice(0, STR_MAX) || "B2B SaaS",
    employees: employees === undefined ? null : employees,
    technologies: tech,
    recentNews: input.recentNews.trim() || "none",
    firstName: input.firstName.trim() || null,
    lastName: input.lastName.trim() || null,
    title: input.title.trim() || null,
    email: input.email.trim() || null,
  };
  if (!v1.name.length) return null;
  return b64uEncode(JSON.stringify(v1));
}
