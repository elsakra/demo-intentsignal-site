import type { ArchetypeId } from "./archetypes";

export type { ArchetypeId } from "./archetypes";

export type CompanyProfile = {
  name: string;
  domain?: string;
  industry: string;
  employees: number | null;
  technologies: string[];
  recentNews: string | null;
};

export type PersonProfile = {
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  email: string | null;
};

export type EnrichmentSource = "ip" | "rb2b" | "demo";

export type StoredIdentity = {
  version: number;
  visitorId: string;
  company: CompanyProfile;
  person: PersonProfile | null;
  source: EnrichmentSource;
  updatedAt: string;
  archetype: ArchetypeId;
  /** true once RB2B client or webhook wrote person data */
  hasPerson: boolean;
};

export type PublicHeroCopy = {
  hero_h1: string;
  hero_subhead: string;
  cta: string;
  banner: string | null;
};
