import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-mute">404</p>
      <h1 className="mt-4 max-w-[28ch] font-display text-2xl text-ink [text-wrap:balance] md:text-3xl">
        This page didn&apos;t rewrite itself — that one&apos;s on us.
      </h1>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center border border-ink bg-ink px-5 font-mono text-[11px] font-medium uppercase tracking-wider text-cream"
      >
        Back home
      </Link>
    </div>
  );
}
