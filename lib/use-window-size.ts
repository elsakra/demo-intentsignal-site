"use client";

import { useEffect, useState } from "react";

export function useWindowSize() {
  const [w, setW] = useState<number | null>(null);
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    f();
    window.addEventListener("resize", f, { passive: true });
    return () => window.removeEventListener("resize", f);
  }, []);
  return w;
}
