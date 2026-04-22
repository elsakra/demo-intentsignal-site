import { pickArchetype, getArchetypeById } from "@/lib/archetypes";
import { streamPersonalized, parseClaudeTextToJson, DEFAULT_MODEL } from "@/lib/claude";
import { setStoredIdentity } from "@/lib/kv";
import { getDemoByQuery } from "@/lib/demoMode";
import { cookies } from "next/headers";
import {
  buildInitialIdentity,
  enrichFromIp,
} from "@/lib/identify";
import { resolveVisitorIdentity } from "@/lib/serverIdentity";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * GET /api/personalize?visitor_id=...&demo= (optional) — SSE: token, done, or error.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const visitorId =
    searchParams.get("visitor_id") || cookies().get("visitor_id")?.value;
  if (!visitorId) {
    return new Response("missing visitor", { status: 400 });
  }
  const demoQ = searchParams.get("demo");
  if (demoQ) {
    const d = getDemoByQuery(demoQ);
    if (d) {
      const enc = new TextEncoder();
      const s = new ReadableStream({
        start(c) {
          c.enqueue(
            enc.encode(
              `data: ${JSON.stringify({ type: "done", prebaked: d.prebaked, skipStream: true })}\n\n`
            )
          );
          c.close();
        },
      });
      return new Response(s, {
        headers: {
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-cache, no-transform",
        },
      });
    }
  }

  let id = await resolveVisitorIdentity(visitorId, searchParams);
  if (!id) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (ip) {
      const c = (await enrichFromIp(ip)) ?? {
        name: "Unknown",
        industry: "B2B",
        employees: null,
        technologies: [],
        recentNews: "none" as const,
      };
      const st = buildInitialIdentity(visitorId, c, null, "ip");
      await setStoredIdentity(st);
      id = st;
    } else {
      return new Response("no identity", { status: 404 });
    }
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    const arch = getArchetypeById(id.archetype);
    const pre = {
      hero_h1: arch.hero_h1,
      hero_subhead: arch.subhead,
      cta: arch.cta,
      banner: null,
    };
    const enc = new TextEncoder();
    const s = new ReadableStream({
      start(c) {
        c.enqueue(
          enc.encode(
            `data: ${JSON.stringify({ type: "done", prebaked: pre, skipStream: true, reason: "no_api_key" })}\n\n`
          )
        );
        c.close();
      },
    });
    return new Response(s, {
      headers: {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
      },
    });
  }

  const company = id.company;
  const person = id.person;
  const stream = await streamPersonalized(company, person);
  const enc = new TextEncoder();
  let acc = "";
  const readable = new ReadableStream<Uint8Array>({
    async start(c) {
      c.enqueue(
        enc.encode(
          `data: ${JSON.stringify({ type: "model", value: DEFAULT_MODEL })}\n\n`
        )
      );
      try {
        for await (const ev of stream) {
          if (
            ev.type === "content_block_delta" &&
            ev.delta.type === "text_delta"
          ) {
            acc += ev.delta.text;
            c.enqueue(
              enc.encode(
                `data: ${JSON.stringify({ type: "token", value: ev.delta.text })}\n\n`
              )
            );
          }
        }
        if (acc.length) {
          const parsed = parseClaudeTextToJson(acc, company, person);
          c.enqueue(
            enc.encode(
              `data: ${JSON.stringify({ type: "done", copy: parsed })}\n\n`
            )
          );
        } else {
          const arch = pickArchetype(company);
          c.enqueue(
            enc.encode(
              `data: ${JSON.stringify({
                type: "done",
                prebaked: {
                  hero_h1: arch.hero_h1,
                  hero_subhead: arch.subhead,
                  cta: arch.cta,
                  banner: null,
                },
                skipStream: true,
              })}\n\n`
            )
          );
        }
      } catch (e) {
        const arch = pickArchetype(company);
        c.enqueue(
          enc.encode(
            `data: ${JSON.stringify({ type: "error", error: String(e) })}\n\n`
          )
        );
        c.enqueue(
          enc.encode(
            `data: ${JSON.stringify({
              type: "done",
              prebaked: {
                hero_h1: arch.hero_h1,
                hero_subhead: arch.subhead,
                cta: arch.cta,
                banner: null,
              },
            })}\n\n`
          )
        );
      } finally {
        c.close();
      }
    },
  });
  return new Response(readable, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
}
