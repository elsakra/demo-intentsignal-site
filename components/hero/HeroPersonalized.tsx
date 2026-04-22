"use client";

import { HeroBlock } from "./HeroBlock";
import { useStreamingText } from "./useStreamingText";
import type { PublicHeroCopy } from "@/lib/types";

type Props = {
  base: PublicHeroCopy;
  target: PublicHeroCopy | null;
  streamActive: boolean;
  statusLine?: string | null;
};

/**
 * When `streamActive` and `target` are set, `useStreamingText` drives
 * delete-then-type. Parent supplies SSE or completion state.
 */
export function HeroPersonalized({
  base,
  target,
  streamActive,
  statusLine,
}: Props) {
  const { h1, sub, cta, banner } = useStreamingText({
    base,
    target,
    active: streamActive && Boolean(target),
  });
  return (
    <HeroBlock
      h1={h1}
      sub={sub}
      cta={cta}
      banner={banner}
      statusLine={statusLine}
    />
  );
}
