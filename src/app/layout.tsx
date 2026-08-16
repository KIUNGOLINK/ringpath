import type { Metadata } from "next";
import { Instrument_Sans, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { DemoNav } from "@/components/DemoNav";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "RingPath — Every round builds your path.",
  description:
    "RingPath is digital career infrastructure for boxers — training, coaching, competition, video review, and scouting in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-obsidian text-bone font-sans">
        {children}
        <DemoNav />
        <Analytics />
      </body>
    </html>
  );
}
