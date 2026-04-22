"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { encodePlayPayload } from "@/lib/playIdentity";

const initial = {
  name: "Gong",
  domain: "gong.io",
  industry: "B2B SaaS",
  employees: "1200",
  technologies: "Salesforce, Outreach, 6sense, Snowflake",
  recentNews: "Q4 enterprise pipeline review",
  firstName: "Alex",
  lastName: "N.",
  title: "VP Revenue Marketing",
  email: "alex.d@gong.io",
};

const MAX_GET = 1_800;

export default function PlayPage() {
  const [f, setF] = useState(initial);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErr(null);
      const play = encodePlayPayload({
        name: f.name,
        domain: f.domain,
        industry: f.industry,
        employees: f.employees,
        technologies: f.technologies,
        recentNews: f.recentNews,
        firstName: f.firstName,
        lastName: f.lastName,
        title: f.title,
        email: f.email,
      });
      if (!play) {
        setErr("Check company name and employee count (numbers only).");
        return;
      }
      const home = new URL("/", window.location.origin);
      home.searchParams.set("play", play);
      if (home.toString().length > MAX_GET) {
        setBusy(true);
        try {
          const r = await fetch("/api/preview-identity", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ play }),
            credentials: "include",
          });
          if (!r.ok) {
            const j = (await r.json().catch(() => ({}))) as { error?: string };
            setErr(j.error || `HTTP ${r.status}`);
            return;
          }
          window.location.assign("/");
        } finally {
          setBusy(false);
        }
        return;
      }
      window.location.assign(home.toString());
    },
    [f]
  );

  return (
    <div className="min-h-dvh bg-cream px-4 py-12 md:px-8">
      <div className="mx-auto max-w-xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
          Preview / simulator
        </p>
        <h1 className="mt-2 font-display text-2xl text-ink md:text-3xl">
          Simulate a visit
        </h1>
        <p className="mt-2 text-sm text-ink-3 [text-wrap:balance]">
          Build a shareable <code className="font-mono text-ink">?play=</code> link
          or set a short cookie if the URL is very long. Same payload powers the
          home page identity strip and personalization.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 border border-ink bg-white p-5 md:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-mono text-mute">
              Company name *
              <input
                className="mt-1.5 w-full border border-line px-2 py-1.5 font-sans text-sm text-ink"
                value={f.name}
                onChange={(e) => setF((s) => ({ ...s, name: e.target.value }))}
                required
              />
            </label>
            <label className="block text-xs font-mono text-mute">
              Company domain
              <input
                className="mt-1.5 w-full border border-line px-2 py-1.5 font-sans text-sm text-ink"
                value={f.domain}
                onChange={(e) => setF((s) => ({ ...s, domain: e.target.value }))}
                placeholder="e.g. gong.io"
              />
            </label>
            <label className="block text-xs font-mono text-mute">
              Industry
              <input
                className="mt-1.5 w-full border border-line px-2 py-1.5 font-sans text-sm text-ink"
                value={f.industry}
                onChange={(e) => setF((s) => ({ ...s, industry: e.target.value }))}
              />
            </label>
            <label className="block text-xs font-mono text-mute">
              Employees (number)
              <input
                className="mt-1.5 w-full border border-line px-2 py-1.5 font-sans text-sm text-ink"
                value={f.employees}
                onChange={(e) => setF((s) => ({ ...s, employees: e.target.value }))}
              />
            </label>
          </div>
          <label className="block text-xs font-mono text-mute">
            Technologies (comma-separated)
            <input
              className="mt-1.5 w-full border border-line px-2 py-1.5 font-sans text-sm text-ink"
              value={f.technologies}
              onChange={(e) => setF((s) => ({ ...s, technologies: e.target.value }))}
            />
          </label>
          <label className="block text-xs font-mono text-mute">
            Recent context / news (optional, longer)
            <textarea
              className="mt-1.5 w-full min-h-[72px] border border-line px-2 py-1.5 font-sans text-sm text-ink"
              value={f.recentNews}
              onChange={(e) => setF((s) => ({ ...s, recentNews: e.target.value }))}
            />
          </label>
          <p className="font-mono text-[10px] uppercase tracking-wider text-mute">
            Person
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["firstName", "First name", "text"],
                ["lastName", "Last initial / name", "text"],
                ["title", "Title", "text"],
                ["email", "Work email", "email"],
              ] as const
            ).map(([key, label, typ]) => (
              <label key={key} className="block text-xs font-mono text-mute">
                {label}
                <input
                  type={typ}
                  className="mt-1.5 w-full border border-line px-2 py-1.5 font-sans text-sm text-ink"
                  value={f[key as keyof typeof f] as string}
                  onChange={(e) =>
                    setF((s) => ({ ...s, [key]: e.target.value } as typeof s))
                  }
                />
              </label>
            ))}
          </div>
          {err && (
            <p className="text-sm text-signal" role="alert">
              {err}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={busy}
              className="bg-ink px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-wider text-cream"
            >
              {busy ? "Opening…" : "Open home with this visit"}
            </button>
            <Link
              href="/"
              className="text-sm text-ink underline decoration-line underline-offset-2"
            >
              Cancel
            </Link>
          </div>
        </form>
        <p className="mt-6 text-xs text-mute">
          <button
            type="button"
            className="underline"
            onClick={async () => {
              const r = await fetch("/api/preview-identity", { method: "DELETE" });
              if (r.ok) window.location.assign("/");
            }}
          >
            Clear play cookie
          </button>{" "}
          (only if you used a long-URL post)
        </p>
      </div>
    </div>
  );
}
