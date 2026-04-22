import { HeroBlock } from "./HeroBlock";
import type { PublicHeroCopy } from "@/lib/types";

/**
 * First-paint or purely static hero; wiring with archetype/SSR.
 */
export function HeroGeneric({ copy }: { copy: PublicHeroCopy }) {
  return (
    <HeroBlock
      h1={copy.hero_h1}
      sub={copy.hero_subhead}
      cta={copy.cta}
      banner={copy.banner}
    />
  );
}
