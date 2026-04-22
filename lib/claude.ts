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

const SYSTEM = `You write landing page copy for IntentSignal.ai, a GTM engineering agency. Output JSON only, no markdown, no prose. Schema: {hero_h1: string, hero_subhead: string, cta: string, banner: string|null}. Hero h1: <14 words, references visitor's specific situation, no fluff words (unlock, supercharge, revolutionize, empower). Subhead: 2 sentences max, names one specific system we'd build and one similar client. CTA: <5 words, action verb. Banner: only if visitor has a recent high-signal event (funding, exec hire, product launch in last 30 days), else null. Voice: senior GTM engineer who's seen every stack and has opinions. Never sycophantic. Confident but specific.`;

function userMessage(
  c: CompanyProfile,
  p: PersonProfile | null
): string {
  const firstName = p?.firstName;
  const lastName = p?.lastName;
  const title = p?.title;
  return `Visitor: ${firstName ?? "unknown"} ${lastName ?? ""}, ${title ?? "unknown role"} at ${c.name}.\nIndustry: ${c.industry}\nSize: ${c.employees == null ? "unknown" : `${c.employees} employees`}\nStack: ${(c.technologies || []).slice(0, 5).join(", ") || "unknown"}\nRecent signal: ${c.recentNews ?? "none"}\nOur relevant clients: ${filterRelevantClients(c).join(", ")}\nOur recent opps in their space: ${filterRelevantOpps(c).join(", ")}

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
