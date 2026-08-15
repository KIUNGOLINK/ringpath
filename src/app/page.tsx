import Link from "next/link";
import Image from "next/image";
import { SparMark } from "@/components/spar/SparLogo";
import { GloveIcon } from "@/components/icons/Icon";

const INSTAGRAM_URL =
  "https://www.instagram.com/spar.ringpath?igsh=MWJydjNlc2U3ZHFxcA%3D%3D&utm_source=qr";

const STEPS = [
  {
    n: "01",
    title: "Cherche",
    body: "Filtre par ville, trouve une session près de chez toi.",
  },
  {
    n: "02",
    title: "Demande",
    body: "Un message à l'organisateur, il valide. Pas de compte pour parcourir, il en faut un pour rejoindre un sparring.",
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

        <header className="absolute top-0 left-0 right-0 h-[72px] flex items-center px-6 md:px-[72px]">
          <div className="flex items-center gap-2.5">
            <SparMark size={26} />
            <span className="text-[19px] font-bold tracking-[-0.01em] text-bone">SPAR</span>
          </div>
        </header>

        <div className="absolute left-6 md:left-[72px] right-6 md:right-auto bottom-24 max-w-[900px]">
          <h1 className="text-[40px] leading-[42px] md:text-[76px] md:leading-[76px] font-bold tracking-[-0.02em] text-bone mb-8">
            TROUVE TON
            <br />
            PROCHAIN SPARRING.
          </h1>
          <div className="flex flex-wrap gap-6 items-center">
            <Link
              href="/app/spar"
              className="h-[52px] px-6 rounded-pill bg-bone text-obsidian text-[15px] font-semibold inline-flex items-center transition-transform hover:scale-[1.015] hover:bg-pure-white active:scale-[0.98]"
            >
              Trouver un sparring
            </Link>
            <Link href="/app?intent=spar&login=1" className="text-[15px] font-semibold text-bone hover:text-mist transition-colors">
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- Comment ça marche / règles ---------- */}
      <section id="comment-ca-marche" className="px-6 md:px-[72px] py-20 md:py-28 max-w-[1100px] mx-auto">
        <div className="text-xs font-semibold tracking-[0.05em] text-fight-red mb-3">COMMENT ÇA MARCHE</div>
        <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-0.01em] text-bone mb-4 max-w-[560px]">
          Trois étapes.
        </h2>
        <p className="text-mist text-[15px] leading-6 mb-14 max-w-[480px]">
          Gratuit, sans engagement.
        </p>
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
              Parcours les sessions ouvertes près de chez toi, pas besoin de compte pour regarder.
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

      {/* ---------- Footer ---------- */}
      <footer className="px-6 md:px-[72px] pb-10">
        <div className="flex justify-center pb-10 mb-8 border-b border-steel">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-bone hover:text-mist transition-colors"
          >
            <span className="glove-punch glove-punch-left inline-flex text-fight-red">
              <GloveIcon size={22} />
            </span>
            <span className="text-sm font-semibold tracking-[0.04em]">ABONNEZ-VOUS SUR INSTAGRAM</span>
            <span className="glove-punch glove-punch-right inline-flex text-fight-red">
              <GloveIcon size={22} />
            </span>
          </a>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-smoke">
          <span>PAR RINGPATH</span>
          <span>© 2026 RingPath</span>
          <span>Made for the ring.</span>
        </div>
      </footer>

      <style>{`
        @keyframes gloveLeftPunch {
          0%, 20%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(5px) rotate(-10deg); }
        }
        @keyframes gloveRightPunch {
          0%, 20%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-5px) rotate(10deg); }
        }
        .glove-punch-left { animation: gloveLeftPunch 1.6s ease-in-out infinite; }
        .glove-punch-right { animation: gloveRightPunch 1.6s ease-in-out infinite 0.4s; }
        @media (prefers-reduced-motion: reduce) {
          .glove-punch-left, .glove-punch-right { animation: none; }
        }
      `}</style>
    </div>
  );
}
