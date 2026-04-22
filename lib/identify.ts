import type { CompanyProfile, PersonProfile, StoredIdentity } from "./types";
import { archetypeIds, pickArchetype, type ArchetypeId } from "./archetypes";

const IPINFO_LITE = (ip: string) => `https://api.ipinfo.io/lite/${ip}`;

export function getClientIp(request: Request): string | null {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return null;
}

type IpinfoLite = {
  ip?: string;
  asn?: string;
  as_name?: string;
  as_domain?: string;
  country_code?: string;
  country?: string;
  continent_code?: string;
  hostname?: string;
};

function parseOrgName(org?: string, asName?: string, domain?: string): string {
  if (asName && asName.length > 1) {
    // sometimes "GOOGLE" — keep as name
    return asName.replace(/_/g, " ");
  }
  if (org) {
    const m = org.match(/^(?:AS\d+\s+)?(.+)$/i);
    return (m?.[1] ?? org).trim();
  }
  if (domain) return domain.replace(/^www\./, "");
  return "Unknown organization";
}

function guessIndustry(name: string, asName?: string, domain?: string): string {
  const blob = `${name} ${asName ?? ""} ${domain ?? ""}`.toLowerCase();
  if (/bank|fintech|payment|lending|capital|wealth|crypto/.test(blob))
    return "Fintech";
  if (/retail|ecommerce|e-commerce|store|apparel|dtc|commerce/.test(blob))
    return "E-commerce";
  if (/agenc|consult|services|law|staffing|software/.test(blob))
    return "Professional services";
  if (
    /cloud|data|ai|ml|net|info|io|app|ly|dev/.test(
      (domain ?? "").split(".")[0] ?? ""
    ) ||
    /tech|software|solutions|systems|labs|digital/.test(blob)
  ) {
    return "B2B SaaS";
  }
  return "B2B";
}

function guessEmployeesForIp(name: string): number | null {
  const n = name.toLowerCase();
  if (/\b(google|microsoft|meta|apple|salesforce|oracle|amazon)\b/.test(n))
    return 10_000;
  if (/\b(uber|atlassian|hubspot|zoom|stripe)\b/.test(n)) return 4_000;
  return 120;
}

export function mapToCompany(
  j: Record<string, unknown> | IpinfoLite,
  ip: string
): CompanyProfile {
  const asName = (j as IpinfoLite).as_name;
  const asDomain = (j as IpinfoLite).as_domain;
  const hostname = (j as IpinfoLite).hostname;
  const name = parseOrgName(
    (j as { org?: string }).org,
    asName,
    asDomain ?? (hostname as string) ?? ip
  );
  const industry = guessIndustry(name, asName, asDomain);
  const employees = guessEmployeesForIp(name);
  return {
    name,
    domain: asDomain,
    industry,
    employees,
    technologies: [],
    recentNews: "none",
  };
}

/**
 * Enrich from IP (IPinfo Lite + Bearer). Edge-safe: fetch only.
 */
export async function enrichFromIp(ip: string): Promise<CompanyProfile | null> {
  const token = process.env.IPINFO_TOKEN;
  if (!token) {
    return null;
  }
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.")
  ) {
    return {
      name: "Local / private network",
      industry: "B2B SaaS",
      employees: 50,
      technologies: ["localhost", "vercel", "node"],
      recentNews: "none",
    };
  }
  const res = await fetch(IPINFO_LITE(encodeURIComponent(ip)), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    console.warn("ipinfo error", res.status, await res.text().catch(() => ""));
    return null;
  }
  const j = (await res.json()) as Record<string, unknown>;
  return mapToCompany(j, ip);
}

export function buildInitialIdentity(
  visitorId: string,
  company: CompanyProfile,
  person: PersonProfile | null,
  source: StoredIdentity["source"]
): StoredIdentity {
  const arch = pickArchetype(company);
  return {
    version: 1,
    visitorId,
    company: { ...company },
    person,
    source,
    updatedAt: new Date().toISOString(),
    archetype: arch.id,
    hasPerson: person != null,
  };
}

export function mergePersonIntoIdentity(
  current: StoredIdentity,
  person: PersonProfile
): StoredIdentity {
  return {
    ...current,
    person,
    hasPerson: true,
    version: current.version + 1,
    source: "rb2b",
    updatedAt: new Date().toISOString(),
  };
}

export function newVisitorId(): string {
  return globalThis.crypto.randomUUID();
}

export function coerceArchetypeId(
  id: string | undefined,
  company: CompanyProfile
): ArchetypeId {
  if (id && (archetypeIds as readonly string[]).includes(id)) {
    return id as ArchetypeId;
  }
  return pickArchetype(company).id;
}
