export function MetaMomentFooter() {
  return (
    <section
      className="border border-ink bg-cream px-6 py-20 md:px-14"
      id="meta"
    >
      <h2 className="font-display text-[2.2rem] leading-[0.95] tracking-[-0.025em] text-ink [text-wrap:balance] sm:text-4xl md:text-[3.2rem] lg:text-[4rem] [max-width:24ch]">
        This page just rewrote itself for you. That&apos;s what we build.
      </h2>
      <p className="prose-tight mt-6 max-w-[58ch] text-[15px] text-ink-3 [text-wrap:balance] sm:text-base">
        Everything you saw — the identification, the enrichment, the Claude-generated copy, the
        module choices — uses the same stack we would run on your site, your email programs, and
        your media.
      </p>
      <a
        href="#book"
        className="mt-7 inline-flex h-12 items-center bg-ink px-5 font-mono text-[12px] font-medium uppercase tracking-wider text-cream"
      >
        Book the call →
      </a>
      <p className="prose-tight mt-10 max-w-[60ch] font-mono text-[10px] leading-[1.45] text-mute [text-wrap:balance]">
        Shipped by a small team. Running on Vercel. The Slack thread that takes intro calls is
        probably lighting up.
      </p>
    </section>
  );
}
