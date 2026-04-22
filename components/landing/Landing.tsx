"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { Nav } from "@/components/Nav";
import { HeroBlock, toPublicFromArchetype } from "@/components/hero/HeroBlock";
import { useStreamingText } from "@/components/hero/useStreamingText";
import { LogoStripDual } from "@/components/sections/LogoStripDual";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { VisitorIdentityStrip } from "@/components/VisitorIdentityStrip";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { CalendlySection } from "@/components/sections/CalendlySection";
import { MetaMomentFooter } from "@/components/sections/MetaMomentFooter";
import { TeamBlock } from "@/components/sections/TeamBlock";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { NarratorPanel } from "@/components/narrator/NarratorPanel";
import { Rb2bBridge } from "@/components/effects/Rb2bBridge";
import {
  toCompanyFromHeader,
  toPersonFromHeader,
  type IdentityHeaderPayload,
} from "@/lib/identity-header";
import { getArchetypeById } from "@/lib/archetypes";
import { getDemoPrebaked, getDemoByQuery } from "@/lib/demoMode";
import { DEFAULT_MODEL } from "@/lib/claude";
import type { CompanyProfile, PublicHeroCopy, PersonProfile } from "@/lib/types";
import type { PipelineLine } from "@/components/narrator/NarratorPanel";

type Props = {
  visitorId: string;
  identity: IdentityHeaderPayload | null;
  isDemo: boolean;
  isAdmin: boolean;
  demoParam?: string;
  playParam?: string;
};

function buildBaseCopy(identity: IdentityHeaderPayload | null): PublicHeroCopy {
  const a = getArchetypeById(identity?.archetype);
  return toPublicFromArchetype(a);
}

export function Landing({
  visitorId,
  identity,
  isDemo,
  isAdmin,
  demoParam,
  playParam,
}: Props) {
  const company0 = useMemo(
    () => toCompanyFromHeader(identity, undefined),
    [identity]
  );
  const person0 = toPersonFromHeader(identity);
  const prebakedDemo = getDemoPrebaked(demoParam);
  const isDemoParam = Boolean(getDemoByQuery(demoParam));

  const [statusCompany, setStatusCompany] = useState(company0);
  const [statusPerson, setStatusPerson] = useState<PersonProfile | null>(
    person0
  );
  const [ver, setVer] = useState(identity?.v ?? 0);
  const [reStream, setReStream] = useState(0);
  const [target, setTarget] = useState<PublicHeroCopy | null>(null);
  const [activeAnim, setActiveAnim] = useState(false);
  const [raw, setRaw] = useState("");
  const [streamP, setStreamP] = useState(0);
  const [t0] = useState(() => performance.now());
  const [tEl, setTEl] = useState("t + 0.00s");
  const [stats, setStats] = useState<{ visitors: number; pipeline: number } | null>(null);

  const base = useMemo(() => {
    if (prebakedDemo) return prebakedDemo;
    return buildBaseCopy(identity);
  }, [prebakedDemo, identity]);

  const { h1, sub, cta, banner, isTransitioning } = useStreamingText({
    base,
    target,
    active:
      !isDemoParam &&
      !prebakedDemo &&
      activeAnim &&
      Boolean(target),
  });

  const heroStatus = useMemo(() => {
    if (isDemoParam || prebakedDemo) return null;
    if (isTransitioning) {
      return "Replacing the default hero with your lines on this page…";
    }
    if (!activeAnim) {
      return "Drafting a one-to-one hero for this visit, then the default below is swapped in place…";
    }
    return null;
  }, [isDemoParam, prebakedDemo, activeAnim, isTransitioning]);

  const display = useMemo(() => {
    if (isDemoParam && prebakedDemo) {
      return { h1: prebakedDemo.hero_h1, sub: prebakedDemo.hero_subhead, cta: prebakedDemo.cta, ban: prebakedDemo.banner };
    }
    return { h1, sub, cta, ban: banner };
  }, [isDemoParam, prebakedDemo, h1, sub, cta, banner]);

  const archetype = getArchetypeById(identity?.archetype);

  useEffect(() => {
    const id = setInterval(() => {
      setTEl(`t + ${((performance.now() - t0) / 1000).toFixed(2)}s`);
    }, 200);
    return () => clearInterval(id);
  }, [t0]);

  useEffect(() => {
    let ok = true;
    fetch("/api/visit-stats")
      .then((r) => r.json())
      .then((j) => {
        if (ok && j && typeof j.visitors === "number") {
          setStats({ visitors: j.visitors, pipeline: j.pipeline ?? 0 });
        }
      })
      .catch(() => {});
    return () => {
      ok = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem("visit_bumped") === "1") return;
      window.sessionStorage.setItem("visit_bumped", "1");
    } catch {
      return;
    }
    fetch("/api/visit-stats", { method: "POST" }).catch(() => {});
  }, []);

  // SSE personalize
  useEffect(() => {
    if (isDemoParam) {
      setActiveAnim(!!prebakedDemo);
      if (prebakedDemo) setTarget(prebakedDemo);
      return;
    }
    setRaw("");
    setStreamP(0);
    setTarget(null);
    setActiveAnim(false);
    const u = new URL("/api/personalize", window.location.origin);
    u.searchParams.set("visitor_id", visitorId);
    if (demoParam) u.searchParams.set("demo", demoParam);
    if (playParam) u.searchParams.set("play", playParam);
    const ev = new EventSource(u.toString());
    const on = (e: MessageEvent) => {
      if (!e.data) return;
      const j = JSON.parse(e.data) as {
        type: string;
        value?: string;
        copy?: PublicHeroCopy;
        prebaked?: PublicHeroCopy;
        reason?: string;
      };
      if (j.type === "token" && j.value) {
        setRaw((r) => r + j.value);
        setStreamP((p) => Math.min(1, p + 0.015));
      }
      if (j.type === "done") {
        ev.close();
        if (j.prebaked) {
          setTarget(j.prebaked);
        } else if (j.copy) {
          setTarget(j.copy);
        } else {
          setTarget(
            toPublicFromArchetype(getArchetypeById(identity?.archetype))
          );
        }
        setActiveAnim(true);
        setStreamP(1);
      }
    };
    ev.addEventListener("message", on);
    ev.onerror = () => {
      ev.close();
      setTarget(toPublicFromArchetype(getArchetypeById(identity?.archetype)));
      setActiveAnim(true);
    };
    return () => {
      ev.removeEventListener("message", on);
      ev.close();
    };
  }, [visitorId, demoParam, playParam, isDemoParam, prebakedDemo, identity?.archetype, reStream]);

  // Poll identify-status
  useEffect(() => {
    if (isDemoParam) return;
    let n = 0;
    const max = 45;
    const t = setInterval(async () => {
      n += 1;
      if (n > max) {
        clearInterval(t);
        return;
      }
      const u = new URL("/api/identify-status", window.location.origin);
      u.searchParams.set("visitor_id", visitorId);
      if (demoParam) u.searchParams.set("demo", demoParam);
      if (playParam) u.searchParams.set("play", playParam);
      const r = await fetch(u.toString());
      if (!r.ok) return;
      const j = (await r.json()) as {
        version: number;
        company?: CompanyProfile;
        person?: PersonProfile;
        hasPerson: boolean;
      };
      if (j.company) setStatusCompany(j.company);
      if (j.person) setStatusPerson(j.person);
      if (j.version > ver) {
        setVer(j.version);
        setReStream((x) => x + 1);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [visitorId, demoParam, playParam, isDemoParam, ver]);

  const lines: PipelineLine[] = useMemo(() => {
    const p = statusPerson;
    const c = statusCompany;
    return [
      { key: "1", text: "Identifying visitor…", at: "0ms" },
      p?.firstName
        ? {
            key: "2",
            text: `Resolved: ${p.firstName} ${p.lastName ?? ""} at ${c.name} (${p.title ?? "role"})`,
            at: "—",
            done: true,
          }
        : {
            key: "2",
            text: `Resolved: ${c.name} · ${c.industry}`,
            at: "—",
            done: true,
          },
      {
        key: "3",
        text: `Stack: ${(c.technologies || []).slice(0, 4).join(", ") || "—"}`,
        at: "—",
        done: true,
      },
      {
        key: "4",
        text: `Recent signal: ${c.recentNews ?? "none"}`,
        at: "—",
        done: true,
      },
      { key: "5", text: `Generating copy… (${DEFAULT_MODEL})`, at: "—" },
      { key: "6", text: "Rewrite complete", at: tEl },
    ];
  }, [statusCompany, statusPerson, tEl]);

  const plumbing = useCallback(async () => {
    const u = new URL("/api/identify-status", window.location.origin);
    u.searchParams.set("visitor_id", visitorId);
    if (demoParam) u.searchParams.set("demo", demoParam);
    if (playParam) u.searchParams.set("play", playParam);
    const s = await fetch(u.toString());
    const st = s.ok ? await s.json() : {};
    return {
      visitorId,
      model: DEFAULT_MODEL,
      company: (st as { company?: CompanyProfile }).company,
      person: (st as { person?: PersonProfile }).person,
      version: (st as { version?: number }).version,
      stream_excerpt: raw.slice(0, 500),
    };
  }, [visitorId, demoParam, playParam, raw]);

  return (
    <div id="top" className="min-h-dvh">
      <Rb2bBridge />
      <Nav />
      <main>
        <section className="border-b border-line bg-cream px-4 pb-16 pt-10 md:px-12 md:pb-20 md:pt-20">
          <div className="mx-auto max-w-content">
            <p className="kicker font-mono text-[11px] uppercase tracking-wider text-ink-3">
              <span
                className="mr-1.5 inline-block h-2 w-2 translate-y-px rounded-full bg-signal"
                style={{ boxShadow: "0 0 0 3px rgba(220,38,38,0.15)" }}
              />
              One-to-one GTM page · live resolve
            </p>
            {stats && (
              <p className="mt-2 font-mono text-[10px] text-mute">
                {stats.visitors.toLocaleString()} visitors on this deploy ·{" "}
                {stats.pipeline.toLocaleString()} flagged for pipeline
              </p>
            )}
            {isAdmin && (
              <p className="mt-1">
                <a
                  href="/play"
                  className="font-mono text-[10px] text-signal underline decoration-signal/40 underline-offset-2"
                >
                  Preview simulator
                </a>
                <span className="ml-2 font-mono text-[9px] text-mute">admin</span>
              </p>
            )}
            <VisitorIdentityStrip
              company={statusCompany}
              person={statusPerson}
              source={identity?.source}
              isAdmin={isAdmin}
            />
            <HeroBlock
              h1={display.h1}
              sub={display.sub}
              cta={display.cta}
              banner={display.ban}
              statusLine={heroStatus}
            />
          </div>
        </section>
        <ProblemSection />
        <section className="border-b border-line bg-cream px-4 pb-12 md:px-12">
          <div className="mx-auto max-w-content">
            <div className="mt-8 grid min-h-0 grid-cols-2 border-y border-line sm:grid-cols-4 sm:divide-x sm:divide-line">
              {(
                [
                  ["Role", "GTM + proof engine"],
                  ["ID source", (isDemo || isDemoParam) ? "demo" : (identity?.source ?? "ip")],
                  ["Accent", "Signal red"],
                  [
                    "Stack hint",
                    statusCompany.technologies[0] ?? "Claude + edge",
                  ],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="border-b border-line px-3 py-3 sm:border-b-0 [border-color:var(--line)]">
                  <div className="font-mono text-[9px] uppercase leading-tight tracking-[0.14em] text-mute">
                    {label}
                  </div>
                  <div className="mt-1.5 font-display text-sm text-ink [text-wrap:balance] sm:text-base">
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-12 md:pt-16">
            <LogoStripDual company={statusCompany} archetype={archetype} />
            </div>
          </div>
        </section>
        <ServicesGrid />
        <HowItWorks getPayload={plumbing} />
        <CaseStudies company={statusCompany} />
        <div className="border-b border-line bg-cream">
          <div className="mx-auto max-w-content px-6 py-20 md:px-12">
            <TeamBlock />
          </div>
        </div>
        <Suspense>
          <CalendlySection
            name={statusPerson?.firstName}
            email={statusPerson?.email}
          />
        </Suspense>
        <div className="mx-auto max-w-content">
          <MetaMomentFooter />
        </div>
        <SiteFooter />
      </main>
      <NarratorPanel
        lines={lines}
        streamProgress={streamP}
        tElapsed={tEl}
        onOpenPlumbing={plumbing}
        identifyMsHint="340"
      />
    </div>
  );
}
