import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { JetBrains_Mono, Newsreader } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

const rb2b = process.env.NEXT_PUBLIC_RB2B_PIXEL_ID ?? "";

export const metadata: Metadata = {
  title: "IntentSignal — GTM engineering",
  description:
    "A live, personalized demo: visitor identification, enrichment, and Claude rewrites in one landing page.",
  metadataBase: new URL("https://demo.intentsignal.ai"),
  openGraph: {
    title: "IntentSignal — demo",
    url: "https://demo.intentsignal.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        display.variable,
        jetbrains.variable
      )}
    >
      <body
        className={cn(GeistSans.className, "min-h-dvh scroll-smooth bg-cream text-ink")}
      >
        {rb2b ? (
          <Script
            id="rb2b-pixel"
            src={`https://ddwl4m2hdecbv.cloudfront.net/b/${rb2b}/${rb2b}.js.gz`}
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
