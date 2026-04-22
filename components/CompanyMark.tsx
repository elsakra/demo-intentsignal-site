/* eslint-disable @next/next/no-img-element -- external logo CDNs, dynamic fallback chain */
"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { companyLogoCandidates, monogramFromName } from "@/lib/companyLogo";
import { cn } from "@/lib/utils";

type Props = {
  domain?: string;
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "full";
  /** Wider, height-fixed wordmark for logo strips (Clearbit is ~4:1). */
  variant?: "default" | "bar";
};

const sizePx: Record<NonNullable<Props["size"]>, number> = {
  sm: 32,
  md: 44,
  lg: 56,
};

/**
 * Tries logo.dev / Clearbit / Google favicon; falls back to a monogram.
 */
export function CompanyMark({
  domain,
  name,
  className,
  size = "md",
  rounded = "md",
  variant = "default",
}: Props) {
  const px = sizePx[size];
  const r = rounded === "full" ? "rounded-full" : rounded === "sm" ? "rounded-sm" : "rounded-md";
  const cands = useMemo(() => companyLogoCandidates(domain), [domain]);
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
  }, [cands, domain, name]);
  const onErr = useCallback(() => {
    setI((x) => (x < cands.length ? x + 1 : x));
  }, [cands.length]);
  if (i >= cands.length || !cands.length) {
    return (
      <div
        className={cn(
          "flex flex-shrink-0 items-center justify-center border border-ink bg-cream font-mono font-medium text-ink-3",
          r,
          variant === "bar" && "h-7 min-w-9 max-w-[100px] px-1",
          className
        )}
        style={variant === "bar" ? { fontSize: 11 } : { width: px, height: px, fontSize: Math.round(px * 0.3) }}
        aria-hidden
      >
        {monogramFromName(name)}
      </div>
    );
  }
  if (variant === "bar") {
    return (
      <img
        src={cands[i]}
        alt=""
        className={cn(
          "h-7 w-auto max-w-[120px] border-0 object-contain object-left p-0",
          className
        )}
        onError={onErr}
      />
    );
  }
  return (
    <img
      src={cands[i]}
      alt=""
      width={px}
      height={px}
      className={cn("flex-shrink-0 border border-line bg-white object-contain p-0.5", r, className)}
      onError={onErr}
    />
  );
}
