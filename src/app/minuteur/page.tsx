import type { Metadata } from "next";
import Link from "next/link";
import { Minuteur } from "@/components/minuteur/Minuteur";

export const metadata: Metadata = {
  title: "Minuteur de boxe en ligne, gratuit",
  description:
    "Minuteur de rounds pour la boxe et le sparring : travail, repos, nombre de rounds, cloche et alerte des 10 dernières secondes. Gratuit, sans compte, installable.",
  alternates: { canonical: "/minuteur" },
  manifest: "/minuteur/manifest",
  openGraph: {
    title: "Minuteur de boxe en ligne, gratuit | Spar",
    description: "Rounds, repos, cloche : le minuteur de boxe qui reste allumé. Gratuit, sans compte.",
    url: "/minuteur",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Minuteur Spar",
  url: "https://www.sparringpath.fr/minuteur",
  applicationCategory: "SportsApplication",
  operatingSystem: "Tout navigateur",
  inLanguage: "fr-FR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

const FORMATS = [
  ["Sparring", "6 rounds de 3 min, 1 min de repos"],
  ["Amateur", "3 rounds de 3 min, 1 min de repos"],
  ["Pro", "12 rounds de 3 min, 1 min de repos"],
  ["Débutant", "5 rounds de 2 min, 1 min de repos"],
  ["HIIT", "8 rounds de 20 s, 10 s de repos"],
];

export default function MinuteurPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Minuteur />

      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <div className="mb-3 text-xs font-semibold tracking-[0.12em] text-fight-red">LE MINUTEUR</div>
            <h1 className="mb-6 font-condensed text-[44px] font-bold uppercase leading-[0.95] md:text-[64px]">
              Un minuteur de boxe
              <br />
              qui reste allumé.
            </h1>
            <p className="mb-4 max-w-[480px] text-[15px] leading-6 text-mist">
              Règle le travail, le repos et le nombre de rounds, ou pars d&rsquo;un format classique. La cloche sonne à chaque changement de
              round, une alerte prévient dans les 10 dernières secondes, et l&rsquo;écran ne s&rsquo;éteint pas pendant la séance.
            </p>
            <p className="max-w-[480px] text-[15px] leading-6 text-mist">
              Gratuit, sans compte. Ajoute-le à ton écran d&rsquo;accueil pour l&rsquo;ouvrir comme une application, en plein écran, sur
              le bord du ring.
            </p>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold tracking-[0.12em] text-smoke">FORMATS</div>
            <ul className="divide-y divide-steel rounded-card bg-carbon">
              {FORMATS.map(([name, detail]) => (
                <li key={name} className="flex items-baseline justify-between gap-4 px-5 py-4">
                  <span className="font-condensed text-2xl font-bold uppercase">{name}</span>
                  <span className="text-right text-sm text-mist">{detail}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-start gap-3 rounded-card bg-graphite p-6">
              <div className="text-lg font-semibold">Plus besoin de tourner tout seul.</div>
              <p className="text-sm leading-6 text-mist">Trouve un partenaire de sparring près de chez toi, gratuitement.</p>
              <Link
                href="/app/spar/find"
                className="mt-1 inline-flex h-12 items-center rounded-pill bg-fight-red px-6 text-[15px] font-semibold text-pure-white transition-transform hover:scale-[1.02] hover:text-pure-white"
              >
                Trouver un sparring
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
