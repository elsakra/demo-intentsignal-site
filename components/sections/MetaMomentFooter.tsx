export function MetaMomentFooter() {
  return (
    <section
      className="border border-ink bg-cream px-6 py-20 md:px-14"
      id="meta"
    >
      <h2 className="font-display text-[2.2rem] leading-[0.95] tracking-[-0.025em] sm:text-4xl md:text-[3.2rem] lg:text-[4rem] [text-wrap:balance] [max-width:20ch]">
        This page just{" "}
        <em className="not-italic font-light text-signal">rewrote itself</em> for you.
        That is what we build.
      </h2>
      <p className="mt-6 max-w-[56ch] text-[0.9rem] leading-[1.45] text-ink-3 sm:text-base">
        Everything you saw — the identification, the enrichment, the generated copy, the
        module choices — is wired with the same stack we would put on your site, email,
        and media.
      </p>
      <a
        href="#book"
        className="mt-7 inline-flex h-12 items-center bg-ink px-5 font-mono text-[12px] font-medium uppercase tracking-wider text-cream"
      >
        Book the call →
      </a>
    </section>
  );
}
