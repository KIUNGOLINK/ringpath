import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, GloveIcon } from "@/components/icons/Icon";

export const INSTAGRAM_URL = "https://www.instagram.com/spar.ringpath?igsh=MWJydjNlc2U3ZHFxcA%3D%3D&utm_source=qr";

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 text-xs font-semibold tracking-[0.12em] text-fight-red">{children}</div>;
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-condensed text-[44px] font-bold uppercase leading-[0.95] tracking-[-0.01em] md:text-[72px]">{children}</h2>
  );
}

const wrap = "mx-auto max-w-[1200px] px-6 md:px-10";

/* ---------- Deux façons de boxer ---------- */
export function Modes() {
  return (
    <section id="modes" className={`${wrap} scroll-mt-20 pb-24 md:pb-32`}>
      <Kicker>DEUX FAÇONS DE BOXER</Kicker>
      <div className="mb-12">
        <H2>
          Un créneau,
          <br />
          deux intentions.
        </H2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Open Rounds */}
        <article className="flex flex-col overflow-hidden rounded-card bg-carbon">
          <div className="relative aspect-[4/3] w-full md:aspect-[16/11]">
            <Image
              src="/marketing/open-rounds.jpg"
              alt="Deux boxeurs qui se touchent les gants avant un round"
              fill
              sizes="(min-width: 768px) 560px, 100vw"
              className="object-cover object-[50%_30%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/10 to-transparent" />
          </div>
          <div className="flex flex-1 flex-col p-7 md:p-9">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.12em] text-fight-red">OPEN ROUNDS</div>
            <h3 className="mb-3 font-condensed text-4xl font-bold uppercase leading-none md:text-5xl">Envie de boxer.</h3>
            <p className="mb-6 max-w-[460px] text-[15px] leading-6 text-mist">
              Un sparring détente. Tu proposes un créneau et un lieu, jusqu&rsquo;à 5 places, et les boxeurs motivés de ta ville demandent à
              rejoindre. Pas de critères à remplir, juste de l&rsquo;envie.
            </p>
            <ul className="mt-auto flex flex-wrap gap-2 text-xs font-semibold text-bone">
              {["Jusqu'à 5 places", "Sans prise de tête", "Tous niveaux"].map((t) => (
                <li key={t} className="rounded-pill bg-graphite px-3.5 py-2">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Camp Spar */}
        <article className="flex flex-col overflow-hidden rounded-card bg-carbon">
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-graphite p-8 md:aspect-[16/11]">
            <div className="w-full max-w-[380px]">
              <div className="mb-3 text-[11px] font-semibold tracking-[0.12em] text-smoke">TES CRITÈRES</div>
              <div className="divide-y divide-steel rounded-card bg-carbon">
                {[
                  ["Poids", "68 à 74 kg"],
                  ["Garde", "Orthodoxe"],
                  ["Niveau", "Compétiteur amateur"],
                  ["Intensité", "Prépa compét"],
                  ["Rounds visés", "8"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-smoke">{k}</span>
                    <span className="font-semibold text-bone">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 text-[11px] text-smoke">Exemple de critères d&rsquo;un Camp Spar.</div>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-7 md:p-9">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.12em] text-fight-red">CAMP SPAR</div>
            <h3 className="mb-3 font-condensed text-4xl font-bold uppercase leading-none md:text-5xl">Une préparation précise.</h3>
            <p className="mb-6 max-w-[460px] text-[15px] leading-6 text-mist">
              Tu prépares un combat ou tu veux un partenaire précis. Tu fixes le poids, la garde, le niveau, l&rsquo;intensité et le nombre
              de rounds, et tu ne reçois que des demandes qui collent.
            </p>
            <ul className="mt-auto flex flex-wrap gap-2 text-xs font-semibold text-bone">
              {["Poids", "Garde", "Niveau", "Intensité", "Rounds"].map((t) => (
                <li key={t} className="rounded-pill bg-graphite px-3.5 py-2">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ---------- Comment ça marche ---------- */
const STEPS = [
  { n: "01", title: "Cherche", body: "Filtre par ville, trouve une session près de chez toi." },
  {
    n: "02",
    title: "Demande",
    body: "Un message à l'organisateur, il valide. Pas de compte pour parcourir, il en faut un pour rejoindre un sparring.",
  },
  { n: "03", title: "Boxe", body: "Minuteur de rounds intégré à l'app. Plus besoin d'outil tiers sur place." },
];

export function Steps() {
  return (
    <section id="comment-ca-marche" className={`${wrap} scroll-mt-20 pb-24 md:pb-32`}>
      <Kicker>COMMENT ÇA MARCHE</Kicker>
      <div className="mb-4">
        <H2>3 étapes.</H2>
      </div>
      <p className="mb-14 max-w-[480px] text-[15px] leading-6 text-mist">Gratuit, sans engagement.</p>
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((s) => (
          <div key={s.n} className="border-t border-steel pt-7">
            <div className="mb-4 font-condensed text-6xl font-bold leading-none text-fight-red md:text-7xl">{s.n}</div>
            <div className="mb-2 font-condensed text-3xl font-bold uppercase">{s.title}</div>
            <p className="text-[15px] leading-6 text-mist">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Minuteur ---------- */
export function TimerSection() {
  return (
    <section id="minuteur" className="scroll-mt-20 bg-carbon">
      <div className={`${wrap} grid items-center gap-12 py-24 md:grid-cols-2 md:gap-16 md:py-32`}>
        <div>
          <Kicker>LE MINUTEUR</Kicker>
          <div className="mb-6">
            <H2>
              La cloche
              <br />
              est dans l&rsquo;app.
            </H2>
          </div>
          <p className="mb-8 max-w-[460px] text-[15px] leading-6 text-mist">
            Plus besoin d&rsquo;une autre application sur le bord du ring. Règle le travail, le repos et le nombre de rounds, lance, et
            laisse la cloche rythmer la séance.
          </p>
          <ul className="mb-9 flex flex-col gap-3 text-[15px]">
            {[
              "Travail, repos et rounds réglables",
              "Cloche à chaque changement de round",
              "Alerte dans les 10 dernières secondes",
              "Utilisable tout de suite, sans compte",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-bone">
                <CheckIcon size={18} className="shrink-0 text-success" />
                {t}
              </li>
            ))}
          </ul>
          <Link
            href="/app/spar/timer"
            className="inline-flex h-[52px] items-center rounded-pill bg-bone px-7 text-[15px] font-semibold text-obsidian transition-transform hover:scale-[1.015] hover:bg-pure-white hover:text-obsidian active:scale-[0.98]"
          >
            Ouvrir le minuteur
          </Link>
        </div>

        {/* Product mock, in the app's own visual language */}
        <div className="mx-auto w-full max-w-[420px] rounded-lg bg-obsidian p-8 shadow-light-lg ring-1 ring-steel" aria-hidden>
          <div className="mb-2 text-center text-xs font-semibold tracking-[0.14em] text-smoke">ROUND 3 / 6</div>
          <div className="mb-8 text-center font-condensed text-[120px] font-bold leading-none tracking-tight text-bone">02:47</div>
          <div className="mb-6 h-1 w-full rounded-full bg-graphite">
            <div className="h-full w-[38%] rounded-full bg-fight-red" />
          </div>
          <div className="divide-y divide-steel rounded-card bg-carbon">
            {[
              ["TRAVAIL", "3:00", "#E31B23"],
              ["REPOS", "1:00", "#FFB020"],
              ["ROUNDS", "6", "#4C8DFF"],
            ].map(([k, v, dot]) => (
              <div key={k} className="flex items-center justify-between px-4 py-3.5 text-sm">
                <span className="flex items-center gap-2.5 font-semibold tracking-wide text-mist">
                  <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
                  {k}
                </span>
                <span className="font-condensed text-2xl font-bold text-bone">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Le code du ring ---------- */
const CODE = [
  { t: "Protections", d: "Gants, protège-dents, coquille. Chacun arrive équipé, le casque selon la session." },
  { t: "Intensité annoncée", d: "Technique, modérée ou prépa compét : on boxe au niveau d'intensité affiché, pas au-dessus." },
  { t: "Niveau honnête", d: "Débutant ou amateur élite, dis où tu en es. Un bon sparring se joue à armes égales." },
  { t: "Stop veut dire stop", d: "Un mot et on lâche. Le respect avant les gants, à chaque round." },
];

export function RingCode() {
  return (
    <section id="code" className={`${wrap} scroll-mt-20 py-24 md:py-32`}>
      <Kicker>LE CODE DU RING</Kicker>
      <div className="mb-12">
        <H2>
          Le respect
          <br />
          avant les gants.
        </H2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {CODE.map((c, i) => (
          <div key={c.t} className="flex gap-5 rounded-card bg-carbon p-7 md:p-8">
            <div className="font-condensed text-4xl font-bold leading-none text-smoke">{String(i + 1).padStart(2, "0")}</div>
            <div>
              <div className="mb-1.5 text-lg font-semibold">{c.t}</div>
              <p className="text-[15px] leading-6 text-mist">{c.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Spar est vraiment gratuit ?",
    a: "Oui. Parcourir les sessions, demander à rejoindre et en créer une ne coûtent rien. Si la salle est payante, la part de chacun se règle directement entre boxeurs : Spar n'encaisse rien.",
  },
  {
    q: "Faut-il un compte ?",
    a: "Non pour parcourir les sessions et utiliser le minuteur. Oui pour demander à rejoindre une session ou en créer une, c'est ce qui permet à l'organisateur de savoir à qui il répond.",
  },
  {
    q: "Je suis débutant, c'est pour moi ?",
    a: "Oui. Chaque session indique son mode et le niveau visé, et les Camp Spar précisent le poids, la garde et l'intensité. Choisis celle qui te correspond.",
  },
  {
    q: "Comment se passe une session ?",
    a: "L'organisateur propose une date, une heure, une ville et un lieu. Tu envoies une demande avec un message, il valide, et vous vous retrouvez sur place. Le minuteur de rounds est dans l'app.",
  },
  {
    q: "Qui est responsable en cas de problème ?",
    a: "Spar met les boxeurs en relation, rien de plus. Le sparring se déroule sous la responsabilité des participants et du lieu. Spar n'encaisse aucun paiement et décline toute responsabilité en cas de non-paiement.",
  },
  {
    q: "Dans quelles villes ?",
    a: "Paris, Lyon, Marseille, Toulouse, Nice, Nantes, Strasbourg, Montpellier, Bordeaux, Lille, Rennes, et n'importe quelle autre ville : c'est l'organisateur qui choisit où il boxe.",
  },
  {
    q: "Y a-t-il une application ?",
    a: "Pas encore sur les stores. Spar fonctionne dans ton navigateur et s'installe sur ton écran d'accueil : sur iPhone, Partager puis « Sur l'écran d'accueil », sur Android, le menu puis « Installer l'application ».",
  },
];

export function Faq() {
  return (
    <section id="faq" className={`${wrap} scroll-mt-20 pb-24 md:pb-32`}>
      <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <div>
          <Kicker>QUESTIONS</Kicker>
          <H2>
            FAQ.
          </H2>
          <p className="mt-6 max-w-[320px] text-[15px] leading-6 text-mist">
            Une autre question ? Écris-nous sur{" "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-bone underline underline-offset-4 hover:text-mist">
              Instagram
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-card bg-carbon open:bg-graphite">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-base font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="relative h-4 w-4 shrink-0" aria-hidden>
                  <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 bg-mist" />
                  <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 bg-mist transition-transform group-open:scale-y-0" />
                </span>
              </summary>
              <p className="px-6 pb-6 text-[15px] leading-6 text-mist">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA final + footer ---------- */
export function FinalCta() {
  return (
    <section className={`${wrap} pb-24 md:pb-32`}>
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src="/marketing/cta.jpg"
          alt=""
          fill
          sizes="(min-width: 1200px) 1120px, 100vw"
          className="object-cover object-[50%_28%]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/20" />
        <div className="relative flex flex-col items-start gap-8 px-8 py-16 md:px-16 md:py-24">
          <h2 className="max-w-[640px] font-condensed text-[48px] font-bold uppercase leading-[0.92] tracking-[-0.01em] md:text-[88px]">
            Prêt à monter
            <br />
            sur le ring ?
          </h2>
          <p className="max-w-[420px] text-[15px] leading-6 text-mist">
            Parcours les sessions ouvertes près de chez toi, pas besoin de compte pour regarder.
          </p>
          <Link
            href="/app/spar/find"
            className="inline-flex h-[56px] items-center gap-2 rounded-pill bg-fight-red px-8 text-base font-semibold text-pure-white transition-transform hover:scale-[1.02] hover:text-pure-white active:scale-[0.98]"
          >
            Trouver un sparring <ArrowRightIcon size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className={`${wrap} pb-12`}>
      <div className="mb-8 flex justify-center border-b border-steel pb-10">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-bone transition-colors hover:text-mist"
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
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-smoke sm:flex-row">
        <span>PAR RINGPATH</span>
        <span>© 2026 RingPath</span>
        <span>Made for the ring.</span>
      </div>
    </footer>
  );
}
