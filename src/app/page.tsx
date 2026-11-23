import Link from "next/link";
import Image from "next/image";
import { SparMark } from "@/components/spar/SparLogo";
import { ScrollBar } from "@/components/site/ScrollBar";
import { SessionsLive, type LiveSession } from "@/components/site/SessionsLive";
import { Modes, Steps, TimerSection, RingCode, Faq, FAQ, FinalCta, SiteFooter } from "@/components/site/Sections";
import { createPublicClient } from "@/lib/supabase/public";
import { listSparSessions } from "@/lib/supabase/spar";

// Statically generated, refreshed every minute so open sessions stay current.
export const revalidate = 60;

async function getLiveSessions(): Promise<LiveSession[]> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const sessions = await listSparSessions(createPublicClient(), { fromDate: today });
    return sessions.slice(0, 6).map((s) => ({
      id: s.id,
      mode: s.mode,
      status: s.status,
      session_date: s.session_date,
      start_time: s.start_time,
      city: s.city,
      venue_name: s.venue_name,
      min_weight_kg: s.min_weight_kg,
      max_weight_kg: s.max_weight_kg,
      level: s.level,
    }));
  } catch {
    // The page must never fail to render because the database is unreachable.
    return [];
  }
}

export default async function Home() {
  const sessions = await getLiveSessions();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Spar",
        url: "https://www.sparringpath.fr",
        inLanguage: "fr-FR",
        description: "Spar met les boxeurs en relation pour sparrer.",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="bg-obsidian">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ScrollBar />

      {/* ---------- Hero ---------- */}
      <div className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <div className="absolute inset-0 md:left-auto md:w-[56%]">
          <Image
            src="/marketing/hero-sparring.jpg"
            alt="Deux boxeurs en plein échange de sparring"
            fill
            priority
            sizes="(min-width: 768px) 56vw, 100vw"
            className="object-cover object-[50%_22%]"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,7,7,.65) 0%, rgba(7,7,7,.25) 32%, rgba(7,7,7,.35) 62%, rgba(7,7,7,.96) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(90deg, #070707 38%, rgba(7,7,7,.55) 56%, rgba(7,7,7,0) 78%)" }}
        />

        <header className="absolute left-0 right-0 top-0 mx-auto flex h-[72px] max-w-[1200px] items-center px-6 md:px-10">
          <div className="flex items-center gap-2.5">
            <SparMark size={28} />
            <span className="font-condensed text-[26px] font-bold tracking-wide text-bone">SPAR</span>
          </div>
        </header>

        <div className="absolute inset-x-0 bottom-20 md:bottom-24">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <h1 className="mb-8 font-condensed text-[68px] font-bold uppercase leading-[0.88] tracking-[-0.01em] text-bone md:text-[132px]">
              Trouve ton
              <br />
              prochain
              <br />
              sparring.
            </h1>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/app/spar/find"
                className="inline-flex h-[52px] items-center rounded-pill bg-bone px-7 text-[15px] font-semibold text-obsidian transition-transform hover:scale-[1.015] hover:bg-pure-white hover:text-obsidian active:scale-[0.98]"
              >
                Trouver un sparring
              </Link>
              <Link href="/app?login=1" className="text-[15px] font-semibold text-bone transition-colors hover:text-mist">
                Se connecter
              </Link>
            </div>
            {sessions.length > 0 && (
              <a
                href="#sessions"
                className="mt-7 inline-flex items-center gap-2.5 text-sm font-medium text-mist transition-colors hover:text-bone"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                {sessions.length} session{sessions.length > 1 ? "s" : ""} ouverte{sessions.length > 1 ? "s" : ""} en ce moment
              </a>
            )}
          </div>
        </div>
      </div>
      <div id="hero-end" aria-hidden />

      <SessionsLive sessions={sessions} />
      <Modes />
      <Steps />
      <TimerSection />
      <RingCode />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
