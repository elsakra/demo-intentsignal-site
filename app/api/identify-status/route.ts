import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { kvReady } from "@/lib/kv";
import { resolveVisitorIdentity } from "@/lib/serverIdentity";

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
  const st = await resolveVisitorIdentity(visitorId, searchParams);
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
