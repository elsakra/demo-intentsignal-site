import { headers } from "next/headers";
import { parseIdentityFromHeaderBase64url } from "@/lib/identity-header";
import { Landing } from "@/components/landing/Landing";
import { Suspense } from "react";

export default function HomePage({
  searchParams,
}: {
  searchParams: { demo?: string };
}) {
  const h = headers();
  const visitorId = h.get("x-visitor-id") ?? "";
  const identity = parseIdentityFromHeaderBase64url(h.get("x-identity"));
  const isDemo = h.get("x-demo") === "1";
  return (
    <Suspense fallback={<div className="min-h-dvh bg-cream" />}>
      <Landing
        visitorId={visitorId}
        identity={identity}
        isDemo={isDemo}
        demoParam={searchParams?.demo}
      />
    </Suspense>
  );
}
