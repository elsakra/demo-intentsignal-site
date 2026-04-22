import { NextResponse } from "next/server";
import { enrichFromIp } from "@/lib/identify";

export const runtime = "edge";

/**
 * Optional debug/health: ?ip=1.1.1.1
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ip = searchParams.get("ip");
  if (!ip) {
    return NextResponse.json({ error: "ip query required" }, { status: 400 });
  }
  const company = await enrichFromIp(ip);
  return NextResponse.json({ company });
}

export async function POST(req: Request) {
  const j = (await req.json().catch(() => null)) as { ip?: string } | null;
  const ip = j?.ip;
  if (!ip) {
    return NextResponse.json({ error: "ip required" }, { status: 400 });
  }
  const company = await enrichFromIp(ip);
  return NextResponse.json({ company });
}
