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
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-14">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8a8578]">
                Book the teardown call
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] leading-[1.1] text-white sm:text-[2.1rem]">
                20 minutes.
                <br />
                We will audit one thing in your GTM stack —{" "}
                <em className="text-[#FF8A8A] not-italic font-light">live, for free</em>.
              </h2>
              <ol className="mt-4 space-y-0 border-t border-line/30 text-[#D6D1BF]">
                <li className="grid grid-cols-[28px_1fr] gap-2 border-b border-line/20 py-2.5 text-sm">
                  <span className="pt-0.5 font-mono text-[#FF8A8A]">01</span>
                  <span>What is broken in your current motion.</span>
                </li>
                <li className="grid grid-cols-[28px_1fr] gap-2 border-b border-line/20 py-2.5 text-sm">
                  <span className="pt-0.5 font-mono text-[#FF8A8A]">02</span>
                  <span>What we would build in the first 30 days.</span>
                </li>
                <li className="grid grid-cols-[28px_1fr] gap-2 py-2.5 text-sm">
                  <span className="pt-0.5 font-mono text-[#FF8A8A]">03</span>
                  <span>Ballpark pricing. No sales theater.</span>
                </li>
              </ol>
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
