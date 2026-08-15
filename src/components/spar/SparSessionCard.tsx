import { ChevronRightIcon } from "@/components/icons/Icon";

const MODE_LABELS: Record<string, string> = { OPEN_ROUNDS: "OPEN ROUNDS", CAMP_SPAR: "CAMP SPAR" };
const MONTHS_SHORT = ["JANV", "FÉVR", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"];

type SessionCardData = {
  id: string;
  mode: string;
  status: string;
  session_date: string;
  start_time: string;
  city: string;
  venue_name?: string | null;
  min_weight_kg?: number | null;
  max_weight_kg?: number | null;
  level?: string | null;
  hostName?: string;
};

export function SparSessionCard({ session: s, onClick }: { session: SessionCardData; onClick: () => void }) {
  const d = new Date(s.session_date + "T00:00:00");
  const isFull = s.status === "FULL";

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-carbon rounded-card p-3.5 flex items-center gap-3.5 cursor-pointer border border-transparent hover:border-steel transition-colors"
    >
      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-md bg-graphite shrink-0">
        <span className="font-condensed text-2xl font-bold text-bone leading-none">{d.getDate()}</span>
        <span className="text-[10px] font-semibold text-smoke tracking-wide mt-0.5">{MONTHS_SHORT[d.getMonth()]}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-fight-red text-[11px] font-semibold tracking-[0.05em]">{MODE_LABELS[s.mode] ?? s.mode}</span>
          {isFull && <span className="text-smoke text-[11px] font-semibold">COMPLET</span>}
        </div>
        <div className="text-bone font-semibold text-[15px] truncate">
          {s.start_time.slice(0, 5)}
          {s.venue_name ? ` · ${s.venue_name}` : ` · ${s.city}`}
        </div>
        <div className="text-smoke text-[13px] truncate">
          {[
            s.venue_name ? s.city : null,
            s.min_weight_kg && s.max_weight_kg ? `${s.min_weight_kg}–${s.max_weight_kg} KG` : null,
            s.level,
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </div>

      <ChevronRightIcon size={18} className="text-smoke shrink-0" />
    </button>
  );
}
