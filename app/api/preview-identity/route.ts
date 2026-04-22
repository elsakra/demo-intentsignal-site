import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { parsePlayParam } from "@/lib/playIdentity";

export const runtime = "nodejs";

const COOKIE = "play_session";
const MAX_BODY = 6_000;
const RATE = 50;
const WINDOW_SEC = 60;

function isKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Sets HttpOnly `play_session` with the same base64 play payload as `?play=`.
 * Optional when URLs are too long. Rate-limited per IP.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BODY) {
    return NextResponse.json({ ok: false, error: "body too large" }, { status: 400 });
  }
  let o: { play?: string };
  try {
    o = JSON.parse(raw) as { play?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  const play = o.play;
  if (typeof play !== "string" || !play.length) {
    return NextResponse.json({ ok: false, error: "missing play" }, { status: 400 });
  }
  if (isKv()) {
    try {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "—";
      const k = `rl:preview:${ip}`;
      const n = await kv.incr(k);
      if (n === 1) {
        await kv.expire(k, WINDOW_SEC);
      }
      if (n > RATE) {
        return NextResponse.json({ ok: false, error: "rate limit" }, { status: 429 });
      }
    } catch (e) {
      console.warn("preview-identity: rate limit kv", e);
    }
  }
  const visitorId = cookies().get("visitor_id")?.value;
  if (!visitorId) {
    return NextResponse.json({ ok: false, error: "no visitor_id cookie" }, { status: 400 });
  }
  const id = parsePlayParam(play, visitorId);
  if (!id) {
    return NextResponse.json({ ok: false, error: "invalid play payload" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, play, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 2 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

/**
 * Clear play cookie (GET for simple links from /play "Clear" button).
 */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
