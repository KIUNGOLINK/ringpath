import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const SITE_URL = "https://www.sparringpath.fr";
const TITLE = "Spar, trouve ton prochain sparring";
const DESCRIPTION =
  "Spar met les boxeurs en relation pour sparrer. Trouve une session près de chez toi, demande à rejoindre, boxe. Gratuit, sans engagement.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Spar" },
  description: DESCRIPTION,
  applicationName: "Spar",
  keywords: ["sparring", "boxe", "partenaire de sparring", "trouver un sparring", "boxe anglaise", "open rounds", "camp spar"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Spar",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  appleWebApp: { capable: true, title: "Spar", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${instrumentSans.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-obsidian text-bone font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
