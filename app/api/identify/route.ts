import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getStoredIdentity, patchPerson, setStoredIdentity } from "@/lib/kv";
import { mergePersonIntoIdentity } from "@/lib/identify";
import type { PersonProfile, StoredIdentity } from "@/lib/types";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  const A = Buffer.from(a, "utf8");
  const B = Buffer.from(b, "utf8");
  if (A.length !== B.length) return false;
  return timingSafeEqual(A, B);
}

function extractPerson(body: unknown): PersonProfile | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const get = (k: string) =>
    o[k] != null && typeof o[k] === "string" ? (o[k] as string) : null;
  if (!get("email") && !get("firstName") && !get("title")) {
    if (o.detail && typeof o.detail === "object") {
      return extractPerson(o.detail);
    }
  }
  return {
    firstName: get("firstName") || get("first_name"),
    lastName: get("lastName") || get("last_name"),
    title: get("title") || get("jobTitle") || get("role"),
    email: get("email") || get("businessEmail") || get("work_email"),
  };
}

/**
 * HMAC body verification when RB2B signs webhooks. Header name is a guess—override if docs differ.
 */
function verifySignature(rawBody: string, headerSig: string | null): boolean {
  const secret = process.env.RB2B_WEBHOOK_SECRET;
  if (!secret) return true;
  if (!headerSig) return false;
  const h = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  return safeEqual(h, headerSig) || safeEqual(h, headerSig.replace(/^sha256=/, ""));
}

/**
 * Merges person fields into the current session visitor (cookie).
 * Webhook: expects JSON body; optional x-rb2b-signature.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const sig =
    req.headers.get("x-rb2b-signature") ||
    req.headers.get("x-signature") ||
    req.headers.get("x-webhook-signature");
  if (sig && !verifySignature(raw, sig)) {
    return NextResponse.json(
      { ok: false, error: "invalid signature" },
      { status: 401 }
    );
  }

  let j: unknown;
  try {
    j = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const visitorIdFromBody =
    typeof j === "object" && j && "visitor_id" in (j as object)
      ? (j as { visitor_id?: string }).visitor_id
      : null;
  const visitorId = visitorIdFromBody || cookies().get("visitor_id")?.value;
  if (!visitorId) {
    return NextResponse.json(
      { ok: false, error: "visitor_id required" },
      { status: 400 }
    );
  }
  const person = extractPerson(j);
  if (!person) {
    return NextResponse.json({ ok: true, note: "no person fields" });
  }

  const current = await getStoredIdentity(visitorId);
  if (!current) {
    const placeholder: StoredIdentity = {
      version: 0,
      visitorId,
      company: {
        name: "Unknown",
        industry: "B2B",
        employees: null,
        technologies: [],
        recentNews: "none",
      },
      person: null,
      source: "rb2b",
      updatedAt: new Date().toISOString(),
      archetype: "b2b-saas-midmarket",
      hasPerson: false,
    };
    const merged = mergePersonIntoIdentity(placeholder, person);
    await setStoredIdentity(merged);
  } else {
    await patchPerson(visitorId, person);
  }
  return NextResponse.json({ ok: true });
}
