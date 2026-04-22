import { pickArchetype } from "./archetypes";
import type {
  CompanyProfile,
  PersonProfile,
  PublicHeroCopy,
  StoredIdentity,
} from "./types";

const D = (domain: string) => domain.toLowerCase().replace(/^www\./, "");

const demos: Record<
  string,
  {
    company: CompanyProfile;
    person: PersonProfile;
    prebaked: PublicHeroCopy;
  }
> = {
  "gong.io": {
    company: {
      name: "Gong",
      domain: "gong.io",
      industry: "B2B SaaS",
      employees: 1200,
      technologies: ["Salesforce", "Outreach", "6sense", "Snowflake"],
      recentNews: "none",
    },
    person: {
      firstName: "Alex",
      lastName: "N.",
      title: "VP Revenue Marketing",
      email: "alex.d@gong.io",
    },
    prebaked: {
      hero_h1: "Gong: your *outbound* signal is in the data but not in the SDR handoff.",
      hero_subhead:
        "We would wire a live visitor and intent path into a single GTM handoff the way we did for Upside—one pipeline, one owner, SDRs stop switching tabs.",
      cta: "Book 20 minutes",
      banner: null,
    },
  },
  "clickup.com": {
    company: {
      name: "ClickUp",
      domain: "clickup.com",
      industry: "B2B SaaS",
      employees: 900,
      technologies: ["HubSpot", "Segment", "Intercom", "dbt"],
      recentNews: "none",
    },
    person: {
      firstName: "Sam",
      lastName: "R.",
      title: "Head of Growth",
      email: "sam@clickup.com",
    },
    prebaked: {
      hero_h1: "ClickUp: growth *touches* the product, but the GTM path still reads like 2015.",
      hero_subhead:
        "We have built paid + outbound loops for B2B SaaS at this scale: first-party site intent into ad audiences, same stack we use on this page.",
      cta: "See the teardown",
      banner: null,
    },
  },
  "starbucks.com": {
    company: {
      name: "Starbucks",
      domain: "starbucks.com",
      industry: "Retail",
      employees: 350_000,
      technologies: ["Azure", "Snowflake", "Salesforce", "Braze"],
      recentNews: "none",
    },
    person: {
      firstName: "Morgan",
      lastName: "L.",
      title: "Director of Digital",
      email: "morgan.l@starbucks.com",
    },
    prebaked: {
      hero_h1: "Starbucks: *omni* spend should not be blind to on-site and app intent.",
      hero_subhead:
        "We would wire first-party sessions into the same systems your retail media and CRM already trust—less lookalike, more of who actually shows up.",
      cta: "Map one use case",
      banner: null,
    },
  },
  "dollartree.com": {
    company: {
      name: "Dollar Tree",
      domain: "dollartree.com",
      industry: "Retail",
      employees: 195_000,
      technologies: ["Google Ads", "Salesforce", "SAP", "The Trade Desk"],
      recentNews: "none",
    },
    person: {
      firstName: "Riley",
      lastName: "C.",
      title: "VP Marketing",
      email: "riley.c@dollartree.com",
    },
    prebaked: {
      hero_h1: "Dollar Tree: the *CPL* story is a first-party audience problem at your scale.",
      hero_subhead:
        "We help retail brands route real sessions into the same ad + landing stack—similar work to the Route and Albertsons class of buildouts.",
      cta: "Book a call",
      banner: null,
    },
  },
  "vimeo.com": {
    company: {
      name: "Vimeo",
      domain: "vimeo.com",
      industry: "B2B SaaS",
      employees: 1200,
      technologies: ["Marketo", "Outreach", "AWS", "Redshift"],
      recentNews: "none",
    },
    person: {
      firstName: "Jules",
      lastName: "K.",
      title: "CMO",
      email: "jules@vimeo.com",
    },
    prebaked: {
      hero_h1: "Vimeo: *pipeline* and product-led motion still fight for the same account view.",
      hero_subhead:
        "We would unify visitor ID, scoring, and outbound handoff in one GTM path—Gong-class execution without another generic sequence vendor.",
      cta: "Teardown the stack",
      banner: null,
    },
  },
  "hubspot.com": {
    company: {
      name: "HubSpot",
      domain: "hubspot.com",
      industry: "B2B SaaS",
      employees: 7500,
      technologies: ["HubSpot", "Snowflake", "AWS", "Looker"],
      recentNews: "none",
    },
    person: {
      firstName: "Dana",
      lastName: "M.",
      title: "VP Marketing",
      email: "dana@hubspot.com",
    },
    prebaked: {
      hero_h1: "HubSpot: the *GTM* platform story still breaks when the stack is all hub and no last mile.",
      hero_subhead:
        "We ship the glue work between data, ad, and SDR that deck vendors skip—built like product, with tests and owners.",
      cta: "Scope one handoff",
      banner: null,
    },
  },
  "salesforce.com": {
    company: {
      name: "Salesforce",
      domain: "salesforce.com",
      industry: "B2B SaaS",
      employees: 70_000,
      technologies: ["Salesforce", "Tableau", "Slack", "AWS"],
      recentNews: "none",
    },
    person: {
      firstName: "Pat",
      lastName: "J.",
      title: "SVP GTM Systems",
      email: "pat.j@salesforce.com",
    },
    prebaked: {
      hero_h1: "Salesforce: *your* stack already sells GTM, but the internal motion still begs for bespoke glue.",
      hero_subhead:
        "We have built routing and live visitor paths at enterprise GTM orgs: fewer tickets, more shipped routes—same team size.",
      cta: "Walk one route",
      banner: null,
    },
  },
};

export function getDemoByQuery(domain: string | undefined) {
  if (!domain) return null;
  const k = D(domain);
  return demos[k] ?? null;
}

export function getDemoProfile(domain: string | undefined) {
  return getDemoByQuery(domain) ?? null;
}

export function demoToStored(
  visitorId: string,
  domain: string
): StoredIdentity | null {
  const d = getDemoByQuery(domain);
  if (!d) return null;
  return {
    version: 1,
    visitorId,
    company: d.company,
    person: d.person,
    source: "demo",
    updatedAt: new Date().toISOString(),
    archetype: pickArchetype(d.company).id,
    hasPerson: true,
  };
}

export function getDemoPrebaked(
  domain: string | undefined
): PublicHeroCopy | null {
  return getDemoByQuery(domain)?.prebaked ?? null;
}
