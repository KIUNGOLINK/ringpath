import Link from "next/link";
import Image from "next/image";
import { SparMark } from "@/components/spar/SparLogo";
import { ArrowRightIcon } from "@/components/icons/Icon";

const STEPS = [
  {
    n: "01",
    title: "Cherche",
    body: "Filtre par ville, poids, garde, intensité — trouve une session près de chez toi.",
  },
  {
    n: "02",
    title: "Demande",
    body: "Un message à l'organisateur, il valide. Pas de compte requis pour parcourir.",
  },
  {
    n: "03",
    title: "Boxe",
    body: "Minuteur de rounds intégré à l'app. Plus besoin d'outil tiers sur place.",
  },
];

export default function WebHero() {
  return (
    <div className="bg-obsidian">
      {/* ---------- Hero ---------- */}
      <div className="relative h-screen min-h-[640px] overflow-hidden">
        <Image
          src="/marketing/hero-sparring.jpg"
          alt="Deux boxeurs en plein échange de sparring"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_22%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,7,7,.65) 0%, rgba(7,7,7,.25) 32%, rgba(7,7,7,.35) 62%, rgba(7,7,7,.96) 100%)",
          }}
        />

        <header className="absolute top-0 left-0 right-0 h-[72px] flex items-center justify-between px-6 md:px-[72px]">
          <div className="flex items-center gap-2.5">
            <SparMark size={26} />
            <span className="text-[19px] font-bold tracking-[-0.01em] text-bone">SPAR</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-bone">
            <a href="#comment-ca-marche" className="hover:text-mist transition-colors">
              Comment ça marche
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/app" className="hidden sm:inline text-sm font-medium text-bone hover:text-mist transition-colors">
              Se connecter
            </Link>
            <Link
              href="/app/spar"
              className="h-10 px-5 rounded-pill bg-fight-red text-pure-white text-sm font-semibold flex items-center transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Trouver un sparring
            </Link>
          </div>
        </header>

        <div className="absolute left-6 md:left-[72px] right-6 md:right-auto bottom-24 max-w-[900px]">
          <div className="text-[13px] font-semibold tracking-[0.05em] text-fight-red mb-5">PAR RINGPATH</div>
          <h1 className="text-[40px] leading-[42px] md:text-[76px] md:leading-[76px] font-bold tracking-[-0.02em] text-bone mb-6">
            TROUVE TON
            <br />
            PROCHAIN SPARRING.
          </h1>
          <p className="text-lg md:text-[22px] md:leading-[32px] text-mist max-w-[560px] mb-8">
            Un partenaire de sparring près de chez toi, aujourd&rsquo;hui. Gratuit, sans engagement.
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <Link
              href="/app/spar"
              className="h-[52px] px-6 rounded-pill bg-bone text-obsidian text-[15px] font-semibold inline-flex items-center transition-transform hover:scale-[1.015] hover:bg-pure-white active:scale-[0.98]"
            >
              Trouver un sparring
            </Link>
            <a href="#comment-ca-marche" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-bone hover:gap-2.5 transition-all">
              Comment ça marche <ArrowRightIcon size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* ---------- Comment ça marche ---------- */}
      <section id="comment-ca-marche" className="px-6 md:px-[72px] py-20 md:py-28 max-w-[1100px] mx-auto">
        <div className="text-xs font-semibold tracking-[0.05em] text-fight-red mb-3">COMMENT ÇA MARCHE</div>
        <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-0.01em] text-bone mb-14 max-w-[560px]">
          Trois étapes, zéro friction.
        </h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="border-t border-steel pt-6">
              <div className="font-condensed text-4xl font-bold text-fight-red mb-3">{s.n}</div>
              <div className="text-bone font-semibold text-lg mb-2">{s.title}</div>
              <div className="text-mist text-[15px] leading-6">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="px-6 md:px-[72px] pb-24 md:pb-32 max-w-[1100px] mx-auto">
        <div className="rounded-card bg-carbon border border-steel p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.01em] text-bone mb-2">
              Prêt à monter sur le ring ?
            </h2>
            <p className="text-mist text-[15px] max-w-[440px]">
              Parcours les sessions ouvertes près de chez toi — pas besoin de compte pour regarder.
            </p>
          </div>
          <Link
            href="/app/spar"
            className="h-[52px] px-7 rounded-pill bg-fight-red text-pure-white text-[15px] font-semibold inline-flex items-center justify-center shrink-0 transition-transform hover:scale-[1.015] active:scale-[0.98]"
          >
            Trouver un sparring
          </Link>
        </div>
      </section>

      <footer className="px-6 md:px-[72px] pb-10 flex items-center justify-between text-xs text-smoke">
        <span>© 2026 RingPath</span>
        <span>Made for the ring.</span>
      </footer>
    </div>
  );
}
