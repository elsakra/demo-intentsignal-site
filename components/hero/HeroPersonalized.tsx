"use client";

import { HeroBlock } from "./HeroBlock";
import { useStreamingText } from "./useStreamingText";
import type { PublicHeroCopy } from "@/lib/types";

type Props = {
  base: PublicHeroCopy;
  target: PublicHeroCopy | null;
  streamActive: boolean;
  streamRaw: string;
};

/**
 * When `streamActive` and `target` are set, `useStreamingText` drives
 * delete-then-type. Parent supplies SSE state.
 */
export function HeroPersonalized({
  base,
  target,
  streamActive,
  streamRaw,
}: Props) {
  const { h1, sub, cta, banner } = useStreamingText({
    base,
    target,
    active: streamActive && Boolean(target),
    rawStream: streamRaw,
  });
  return <HeroBlock h1={h1} sub={sub} cta={cta} banner={banner} />;
}
