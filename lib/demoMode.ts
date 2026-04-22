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
      hero_h1: "Alex, we already build what Gong’s peers run in GTM.",
      hero_subhead:
        "We ship outbound pipelines, LinkedIn and Meta ABM, and custom revenue infrastructure — the same stack we built for Gainsight, Upside, and Route. If Gong wants what they have, the next step is a 20-minute teardown call.",
      cta: "Book a teardown call",
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
      hero_h1: "ClickUp: we run paid and outbound off first-party intent.",
      hero_subhead:
        "We have built the LinkedIn, Meta, and on-site ID loops for B2B SaaS at this scale, including for Upside and Route. The stack running this page is the same class of system we would put on yours.",
      cta: "Book a teardown call",
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
      hero_h1: "Starbucks: retail media should run on real site and app signals.",
      hero_subhead:
        "We wire first-party sessions into the ad and CRM systems you already pay for, similar to work we did for Albertsons- and retail-class clients. If the goal is known visitors in-channel, that is a build, not a deck.",
      cta: "Book a teardown call",
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
      hero_h1: "Dollar Tree: CPL is a first-party audience problem at your scale.",
      hero_subhead:
        "We route real sessions into paid and landing systems you already run, the same class of work we shipped for Route and other retail GTM orgs. We can map one use case in 20 minutes.",
      cta: "Book a teardown call",
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
      hero_h1: "Vimeo: one account view for product-led and sales-led GTM.",
      hero_subhead:
        "We unify visitor ID, scoring, and outbound handoff in one path — the same systems-class work we have shipped for B2B SaaS peers. No new sequence vendor; engineered routing and data.",
      cta: "Book a teardown call",
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
      hero_h1: "HubSpot: the last mile between your hub and the field is engineering.",
      hero_subhead:
        "We ship the glue between data, ads, and SDR that slide decks skip — the same product-style builds we have delivered for Gainsight and Upside. One scoped handoff is enough to start.",
      cta: "Book a teardown call",
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
      hero_h1: "Salesforce: enterprise GTM still needs custom routing and live visitors.",
      hero_subhead:
        "We have built live visitor paths and internal routing for large GTM orgs: fewer Jira tickets, more shipped code paths, same team size. We can walk one route on a teardown call.",
      cta: "Book a teardown call",
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
