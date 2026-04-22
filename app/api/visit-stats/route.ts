import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

const K_VIS = "visit_stats:visitors";
const K_PIPE = "visit_stats:pipeline";

function seedVis(): number {
  const n = Number(
    process.env.NEXT_PUBLIC_VISITOR_STATS_SEED_V ??
      process.env.VISITOR_STATS_SEED_V ??
      47
  );
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 47;
}

function seedPipe(): number {
  const n = Number(
    process.env.NEXT_PUBLIC_VISITOR_STATS_SEED_P ??
      process.env.VISITOR_STATS_SEED_P ??
      12
  );
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 12;
}

function hasKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * GET — display counts (seeded when KV not configured or key missing).
 */
export async function GET() {
  if (!hasKv()) {
    return NextResponse.json({
      visitors: seedVis(),
      pipeline: seedPipe(),
      kv: false,
    });
  }
  const vRaw = await kv.get<string | number | null>(K_VIS);
  const pRaw = await kv.get<string | number | null>(K_PIPE);
  const v = vRaw == null ? seedVis() : Number(vRaw) || seedVis();
  const p = pRaw == null ? seedPipe() : Number(pRaw) || seedPipe();
  return NextResponse.json({ visitors: v, pipeline: p, kv: true });
}

/**
 * POST — bump visit counter once per client session.
 */
export async function POST() {
  if (!hasKv()) {
    return NextResponse.json({ ok: true, kv: false });
  }
  const cur = await kv.get<string | number | null>(K_VIS);
  if (cur == null) {
    await kv.set(K_VIS, seedVis() + 1);
  } else {
    const n = (typeof cur === "number" ? cur : parseInt(String(cur), 10)) || 0;
    await kv.set(K_VIS, n + 1);
  }
  if (Math.random() < 0.22) {
    const pCur = await kv.get<string | number | null>(K_PIPE);
    if (pCur == null) {
      await kv.set(K_PIPE, seedPipe() + 1);
    } else {
      const n = (typeof pCur === "number" ? pCur : parseInt(String(pCur), 10)) || 0;
      await kv.set(K_PIPE, n + 1);
    }
  }
  return NextResponse.json({ ok: true, kv: true });
}
