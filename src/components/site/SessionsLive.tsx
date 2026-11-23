import Link from "next/link";
import { SparMark } from "@/components/spar/SparLogo";
import { ChevronRightIcon } from "@/components/icons/Icon";

export type LiveSession = {
  id: string;
  mode: string;
  status: string;
  session_date: string;
  start_time: string;
  city: string;
  venue_name: string | null;
  min_weight_kg: number | null;
  max_weight_kg: number | null;
  level: string | null;
};

const MODE_LABELS: Record<string, string> = { OPEN_ROUNDS: "OPEN ROUNDS", CAMP_SPAR: "CAMP SPAR" };
const MONTHS_SHORT = ["JANV", "FÉVR", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"];

function SessionLinkCard({ s }: { s: LiveSession }) {
  const d = new Date(s.session_date + "T00:00:00");
  const details = [
    s.venue_name ? s.city : null,
    s.min_weight_kg && s.max_weight_kg ? `${s.min_weight_kg}-${s.max_weight_kg} kg` : null,
    s.level,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/app/spar/session/${s.id}`}
      className="group flex items-center gap-4 rounded-card border border-transparent bg-carbon p-4 text-bone transition-colors hover:border-steel hover:bg-graphite hover:text-bone"
    >
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-md bg-graphite group-hover:bg-carbon">
        <span className="font-condensed text-3xl font-bold leading-none">{d.getDate()}</span>
        <span className="mt-0.5 text-[10px] font-semibold tracking-wide text-smoke">{MONTHS_SHORT[d.getMonth()]}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-[0.05em] text-fight-red">{MODE_LABELS[s.mode] ?? s.mode}</span>
          {s.status === "FULL" && <span className="text-[11px] font-semibold text-smoke">COMPLET</span>}
        </div>
        <div className="truncate text-base font-semibold">
          {s.start_time.slice(0, 5)} · {s.venue_name ?? s.city}
        </div>
        {details && <div className="truncate text-sm text-smoke">{details}</div>}
      </div>
      <ChevronRightIcon size={18} className="shrink-0 text-smoke transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function SessionsLive({ sessions }: { sessions: LiveSession[] }) {
  return (
    <section id="sessions" className="mx-auto max-w-[1200px] scroll-mt-20 px-6 py-24 md:px-10 md:py-32">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 text-xs font-semibold tracking-[0.12em] text-fight-red">SESSIONS OUVERTES</div>
          <h2 className="font-condensed text-[44px] font-bold uppercase leading-[0.95] tracking-[-0.01em] md:text-[72px]">
            Ce qui se joue
            <br />
            près de toi.
          </h2>
        </div>
        <Link
          href="/app/spar/find"
          className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-bone transition-all hover:gap-2.5 hover:text-bone"
        >
          Tout voir <ChevronRightIcon size={16} />
        </Link>
      </div>

      {sessions.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {sessions.map((s) => (
            <SessionLinkCard key={s.id} s={s} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-6 rounded-card bg-carbon p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="flex items-start gap-5">
            <SparMark size={44} />
            <div>
              <div className="mb-1.5 text-xl font-semibold">Aucune session ouverte pour l&rsquo;instant.</div>
              <p className="max-w-[480px] text-[15px] leading-6 text-mist">
                Spar vient d&rsquo;ouvrir. Propose la première session de ta ville, les boxeurs autour de toi la verront tout de suite.
              </p>
            </div>
          </div>
          <Link
            href="/app/spar/create"
            className="inline-flex h-[52px] shrink-0 items-center rounded-pill bg-fight-red px-7 text-[15px] font-semibold text-pure-white transition-transform hover:scale-[1.015] hover:text-pure-white active:scale-[0.98]"
          >
            Créer une session
          </Link>
        </div>
      )}
    </section>
  );
}
