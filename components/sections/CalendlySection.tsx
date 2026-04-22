"use client";

import { InlineWidget } from "react-calendly";
import { usePathname, useSearchParams } from "next/navigation";
import { useWindowSize } from "@/lib/use-window-size";

const url =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/d/ck72-7g6-q66";

type Props = {
  name?: string | null;
  email?: string | null;
};

export function CalendlySection({ name, email }: Props) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const w = useWindowSize();
  const h = (w && w < 640 ? 900 : 700) + "px";
  return (
    <section id="book" className="scroll-mt-20 border-b border-line">
      <div className="border-t border-ink/30 bg-panel text-[#E9E3D4]">
        <div className="mx-auto max-w-content px-4 py-10 md:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8a8578]">
                Book the teardown call
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] leading-[1.1] text-white sm:text-[2.1rem] [text-wrap:balance]">
                20 minutes. We will audit one live piece of your GTM stack and tell you what we
                would ship in the first 30 days. Ballpark cost. No sales theater.
              </h2>
            </div>
            <div
              className="min-h-[360px] w-full min-w-0 border border-dashed border-[#3a3834] bg-[#1a1916] p-2"
              style={{ minHeight: h }}
            >
              <div className="h-full w-full min-h-0 min-w-0 overflow-hidden">
                <InlineWidget
                  url={url}
                  styles={{ height: h, minWidth: "320px" }}
                  pageSettings={{
                    backgroundColor: "1a1916",
                    hideEventTypeDetails: false,
                    primaryColor: "dc2626",
                    textColor: "E9E3D4",
                  }}
                  prefill={name && email ? { name, email } : undefined}
                  utm={{
                    utmSource: "demo",
                    utmMedium: "web",
                    utmCampaign: pathname ?? "landing",
                    utmContent: sp?.get("demo") ?? "",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
