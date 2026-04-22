import Anthropic from "@anthropic-ai/sdk";
import { filterRelevantClients, filterRelevantOpps } from "./content";
import { pickArchetype, getArchetypeById, type ArchetypeId } from "./archetypes";
import type { CompanyProfile, PersonProfile, PublicHeroCopy } from "./types";
import { z } from "zod";

const copySchema = z.object({
  hero_h1: z.string(),
  hero_subhead: z.string(),
  cta: z.string(),
  banner: z.string().nullable().optional(),
});

const SYSTEM = `You write B2B homepage copy for IntentSignal.ai, a GTM engineering agency. Follow Fletch PMM rules:

(1) Lead with capability, not metaphor or benefit alone. The category is "GTM engineering agency" — do not invent new category names.
(2) Anchor to that category; name specific clients only from this allowlist when relevant: Gong, Gainsight, Upside, Route, SPINS, Snap, Greenhouse, ClickUp, Vimeo, Starbucks, Albertsons, Avon, Dollar General.
(3) Zero wordplay or alliteration for its own sake. Never use hollow SaaS marketing filler in output.
(4) hero_h1: under 10 words. Include the visitor's first name OR company name OR a concrete stack gap—never a clever metaphor as the whole line.
(5) hero_subhead: exactly 2 sentences. First names one specific deliverable (e.g. outbound system, paid ABM, visitor ID to Slack). Second names one similar client from the allowlist or says what we already shipped for a peer.
(6) cta: 4-5 words, action verb, specific (e.g. "Book a teardown call"). Not "Get started" or "Learn more."
(7) banner: null unless recentNews clearly signals funding, major exec hire, or product launch in the last 30 days; else null.

Output JSON only, no markdown fences, no other keys. Schema: {"hero_h1":"","hero_subhead":"","cta":"","banner":null or string}.`;

function userMessage(
  c: CompanyProfile,
  p: PersonProfile | null
): string {
  const firstName = p?.firstName;
  const lastName = p?.lastName;
  const title = p?.title;
  return `Visitor: ${firstName ?? "unknown"} ${lastName ?? ""}, ${title ?? "unknown role"} at ${c.name}.
Industry: ${c.industry}
Size: ${c.employees == null ? "unknown" : `${c.employees} employees`}
Stack: ${(c.technologies || []).slice(0, 5).join(", ") || "unknown"}
Recent signal: ${c.recentNews ?? "none"}
Relevant clients we have worked with (pick from if useful): ${filterRelevantClients(c).join(", ")}
Recent opps in their space (for context only): ${filterRelevantOpps(c).join(", ")}

Write the JSON now.`;
}

function getAnthropic() {
  const k = process.env.ANTHROPIC_API_KEY;
  if (!k) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey: k });
}

export const DEFAULT_MODEL =
  process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";

function fallback(
  _company: CompanyProfile,
  _person: PersonProfile | null,
  archId: ArchetypeId
): PublicHeroCopy {
  const a = getArchetypeById(archId);
  return {
    hero_h1: a.hero_h1.replace(/\*([^*]+)\*/g, "$1"),
    hero_subhead: a.subhead,
    cta: a.cta,
    banner: null,
  };
}

function parseOrFallback(
  text: string,
  company: CompanyProfile,
  person: PersonProfile | null
): PublicHeroCopy {
  let raw = text.trim();
  const code = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (code) raw = code[1] ?? raw;
  try {
    const j = JSON.parse(raw) as unknown;
    const p = copySchema.safeParse(j);
    if (!p.success) {
      console.warn("claude: json schema fail", p.error);
      return fallback(company, person, pickArchetype(company).id);
    }
    return {
      hero_h1: p.data.hero_h1,
      hero_subhead: p.data.hero_subhead,
      cta: p.data.cta,
      banner: p.data.banner ?? null,
    };
  } catch (e) {
    console.warn("claude: parse", e);
    return fallback(company, person, pickArchetype(company).id);
  }
}

export function parseClaudeTextToJson(
  text: string,
  company: CompanyProfile,
  person: PersonProfile | null
): PublicHeroCopy {
  return parseOrFallback(text, company, person);
}

export async function generatePersonalizedJson(
  company: CompanyProfile,
  person: PersonProfile | null
): Promise<PublicHeroCopy> {
  const a = getAnthropic();
  const res = await a.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 1024,
    stream: false,
    system: SYSTEM,
    messages: [{ role: "user", content: userMessage(company, person) }],
  });
  const block = res.content.find((b) => b.type === "text");
  if (!block || block.type !== "text")
    return fallback(company, person, pickArchetype(company).id);
  return parseOrFallback(block.text, company, person);
}

/**
 * Streams raw text; caller accumulates. On 'message_stop', use parseClaudeTextToJson.
 */
export function streamPersonalized(
  company: CompanyProfile,
  person: PersonProfile | null
) {
  const a = getAnthropic();
  return a.messages.stream({
    model: DEFAULT_MODEL,
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: "user", content: userMessage(company, person) }],
  });
}

export { pickArchetype, SYSTEM, userMessage };
