/**
 * Fletch-style problem block: plain language, dark band for rhythm.
 */
export function ProblemSection() {
  return (
    <section
      className="section-dark border-b border-white/10 scroll-mt-20"
      aria-labelledby="problem-heading"
    >
      <div className="mx-auto max-w-content px-6 py-16 md:px-[72px] md:py-20">
        <h2
          id="problem-heading"
          className="font-display text-[2rem] leading-[1.1] tracking-[-0.02em] text-cream [text-wrap:balance] sm:text-[2.5rem] md:text-[2.75rem]"
        >
          You already know what&apos;s broken.
        </h2>
        <p className="mt-6 max-w-[60ch] text-base leading-[1.4] text-[#d6d1bf] [text-wrap:balance]">
          Your outbound sequences are indistinguishable from your competitors&apos;. Your ABM
          is a list of accounts with no system behind it. Your RevOps team is one person doing
          the work of four. Your agency sent a deck.
        </p>
        <p className="mt-4 font-display text-lg text-cream [text-wrap:balance]">
          We don&apos;t do any of that.
        </p>
      </div>
    </section>
  );
}
