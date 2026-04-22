import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { b64uEncode } from "@/lib/identity-b64";
import { identityToHeaderPayload, type IdentityHeaderPayload } from "@/lib/identity-header";
import {
  buildInitialIdentity,
  enrichFromIp,
  getClientIp,
  newVisitorId,
} from "@/lib/identify";
import { demoToStored } from "@/lib/demoMode";

const COOKIE = "visitor_id";

function setVisitorCookie(res: NextResponse, value: string) {
  res.cookies.set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    secure: process.env.NODE_ENV === "production",
  });
}

function applyIdentityHeaders(
  res: NextResponse,
  p: IdentityHeaderPayload
) {
  res.headers.set("x-visitor-id", p.visitorId);
  res.headers.set("x-identity", b64uEncode(JSON.stringify(p)));
}

/**
 * No KV in middleware — @vercel/kv is Node-oriented in v3. Identity is
 * built here for headers; /api/* persists to KV in Node.
 */
export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
  if (pathname.includes(".") && !pathname.startsWith("/.well-known")) {
    return NextResponse.next();
  }

  let visitorId = request.cookies.get(COOKIE)?.value;
  if (!visitorId) {
    visitorId = newVisitorId();
  }
  const res = NextResponse.next();
  setVisitorCookie(res, visitorId);

  const demoParam = searchParams.get("demo");
  if (demoParam) {
    const demo = demoToStored(visitorId, demoParam);
    if (demo) {
      applyIdentityHeaders(res, identityToHeaderPayload(demo));
      res.headers.set("x-demo", "1");
      return res;
    }
  }

  const ip = getClientIp(request);
  if (!ip) {
    const generic = buildInitialIdentity(
      visitorId,
      {
        name: "Unknown visitor",
        industry: "B2B SaaS",
        employees: null,
        technologies: [],
        recentNews: "none",
      },
      null,
      "ip"
    );
    applyIdentityHeaders(res, identityToHeaderPayload(generic));
    return res;
  }

  const company = (await enrichFromIp(ip)) ?? {
    name: "Unknown company",
    industry: "B2B SaaS",
    employees: null,
    technologies: [],
    recentNews: "none",
  };
  const identity = buildInitialIdentity(visitorId, company, null, "ip");
  applyIdentityHeaders(res, identityToHeaderPayload(identity));
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|gz|txt|woff2?)$).*)",
  ],
};
