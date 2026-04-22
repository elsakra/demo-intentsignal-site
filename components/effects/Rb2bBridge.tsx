"use client";

import { useEffect } from "react";

/**
 * Fires a server merge when the pixel (or a matching event) identifies the visitor.
 * Event name: verify in RB2B — common pattern `rb2b-identified` / `rb2b:identified`
 */
export function Rb2bBridge() {
  useEffect(() => {
    const h = (ev: Event) => {
      const d =
        (ev as CustomEvent<Record<string, unknown>>).detail ??
        (ev as { data?: unknown }).data;
      void fetch("/api/identify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ from: "pixel", ...((d as object) || {}) }),
      });
    };
    const names = ["rb2b-identified", "rb2b:identified", "Reb2bIdentified"] as const;
    for (const n of names) {
      try {
        window.addEventListener(n, h);
      } catch {
        // ignore
      }
    }
    return () => {
      for (const n of names) {
        try {
          window.removeEventListener(n, h);
        } catch {
          // ignore
        }
      }
    };
  }, []);
  return null;
}
