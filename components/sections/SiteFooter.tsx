export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-content border-t border-ink px-6 py-10 text-mute">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="relative grid h-6 w-6 place-items-center border border-ink" aria-hidden>
              <span className="h-1 w-1 rounded-full bg-signal" />
            </span>
            <span
              className="font-mono text-sm font-medium"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              intentsignal<span className="text-mute">.ai</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed [max-width:28ch]">
            A GTM engineering agency.
            <br />
            Brooklyn · Austin · remote.
          </p>
        </div>
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em]">Services</p>
          <p className="text-[13px] leading-8 text-ink/90">
            Cold Outbound
            <br />
            Paid Social
            <br />
            GTM Engineering
            <br />
            Answer Engine Optimization
          </p>
        </div>
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em]">Contact</p>
          <p className="text-[13px] leading-8 text-ink/90">
            <a className="underline" href="mailto:hello@intentsignal.ai">
              hello@intentsignal.ai
            </a>
            <br />
            data.intentsignal.ai ↗<br />
            LinkedIn ↗<br />
            X ↗
          </p>
        </div>
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em]">Colophon</p>
          <p className="text-[10px] leading-[1.7] [max-width:28ch] text-ink-3" style={{ fontFamily: "var(--font-mono)" }}>
            Built in Claude + Cursor. Running on Vercel edge. Identified via RB2B. ©
            2026 IntentSignal, LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}
