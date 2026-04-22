"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  getPayload: () => Promise<Record<string, unknown>> | Record<string, unknown>;
};

export function PlumbingDrawer({ open, onOpenChange, getPayload }: Props) {
  const [raw, setRaw] = useState<string>("{}");
  useEffect(() => {
    if (!open) return;
    void (async () => {
      const p = await getPayload();
      setRaw(JSON.stringify(p, null, 2));
    })();
  }, [open, getPayload]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(100vw,360px)] border-panel bg-[#0E0E0E] p-0 text-[#D6D1BF] sm:max-w-[360px]"
        aria-label="Plumbing JSON payload"
      >
        <SheetHeader className="border-b border-dashed border-[#2a2925] px-5 py-3">
          <SheetTitle className="font-mono text-left text-sm text-white">
            /api/sessions/… · redacted.json
          </SheetTitle>
          <p className="text-right font-mono text-[10px] text-[#7a7770]">
            [esc] close
          </p>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-5rem)]">
          <pre className="whitespace-pre-wrap break-words p-4 font-mono text-[11.5px] leading-relaxed text-[#D6D1BF]">
            {raw}
          </pre>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
