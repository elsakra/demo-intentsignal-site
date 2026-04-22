import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStoredIdentity, kvReady } from "@/lib/kv";
import { getDemoByQuery } from "@/lib/demoMode";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const visitorId =
    searchParams.get("visitor_id") || cookies().get("visitor_id")?.value;
  if (!visitorId) {
    return NextResponse.json(
      { ok: false, error: "no visitor" },
      { status: 400 }
    );
  }
  const demo = searchParams.get("demo");
  if (demo) {
    const d = getDemoByQuery(demo);
    if (d) {
      return NextResponse.json({
        ok: true,
        kv: kvReady(),
        version: 1,
        source: "demo" as const,
        company: d.company,
        person: d.person,
        hasPerson: true,
        updatedAt: new Date().toISOString(),
      });
    }
  }
  const st = await getStoredIdentity(visitorId);
  if (!st) {
    return NextResponse.json({
      ok: true,
      kv: kvReady(),
      version: 0,
      company: null,
      person: null,
      hasPerson: false,
    });
  }
  return NextResponse.json({
    ok: true,
    kv: kvReady(),
    version: st.version,
    source: st.source,
    company: st.company,
    person: st.person,
    hasPerson: st.hasPerson,
    archetype: st.archetype,
    updatedAt: st.updatedAt,
  });
}
