import { seasonCalendar } from "@/data/mock";
import type { CampTab as CampTabType } from "./types";
import type { BoxerAppApi } from "./useBoxerApp";

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function CampTab({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  const displayFirstName = (state.firstName || "").toUpperCase();
  const camp = state.camp;
  const daysOut = daysUntil(camp?.fightDate ?? null);
  const progressPct = camp ? Math.min(100, Math.round((camp.weekCurrent / camp.weekTotal) * 100)) : 0;
  const completedCount = state.sessions.filter((s) => s.completed).length;

  return (
    <div className="px-5 pb-8 pt-1">
      <div className="text-[15px] font-semibold text-bone mb-4">Fight Camp</div>

      <div className="text-center mb-6">
        <div className="text-[15px] font-semibold text-bone">
          {displayFirstName} <span className="text-smoke font-medium">vs</span>{" "}
          {(camp?.opponentName ?? "TBD").toUpperCase()}
        </div>
        <div className="font-condensed text-[56px] leading-[52px] font-bold text-bone mt-2">
          {daysOut !== null ? `${daysOut} DAYS` : "NO FIGHT SET"}
        </div>
      </div>

      <div className="relative h-1 rounded-full bg-graphite mb-8">
        <div className="absolute left-0 top-0 bottom-0 rounded-full bg-bone" style={{ width: `${progressPct}%` }} />
        <div className="absolute right-0 -top-1 w-3 h-3 rounded-full bg-fight-red" />
      </div>

      <div className="flex gap-5 border-b border-steel mb-6">
        {(["overview", "schedule", "sparring"] as CampTabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => api.setCampTab(tab)}
            className={`pb-2.5 text-sm font-semibold capitalize cursor-pointer border-b-2 -mb-px bg-transparent border-x-0 border-t-0 ${
              state.campTab === tab ? "text-bone border-bone" : "text-smoke border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {state.campTab === "overview" && (
        <>
          <div className="text-[13px] text-smoke mb-1">WEEK</div>
          <div className="font-condensed text-5xl leading-[44px] font-bold text-bone mb-6">
            {camp?.weekCurrent ?? 1} / {camp?.weekTotal ?? 8}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { label: "Sessions", value: state.sessions.length },
              { label: "Completed", value: completedCount },
              { label: "Sparring", value: 0 },
              { label: "Recovery", value: 0 },
            ].map((stat) => (
              <div key={stat.label} className="bg-carbon rounded-card p-4">
                <div className="text-[13px] text-smoke mb-2">{stat.label}</div>
                <div className="font-condensed text-3xl text-bone font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-bone rounded-card p-5">
            <div className="text-xs font-semibold tracking-[0.05em] text-smoke mb-4">CAMP OBJECTIVES</div>
            <div className="flex flex-col gap-3.5">
              {(camp?.objectives ?? []).map((obj, i) => (
                <div key={obj} className="flex gap-3">
                  <span className="text-[13px] text-smoke font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] text-obsidian">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {state.campTab === "schedule" && (
        <>
          <div className="text-xs font-semibold tracking-[0.05em] text-smoke mb-1">
            SEASON 2025–2026 — FFBOXE
          </div>
          <div className="text-xs text-[#474747] mb-5">National amateur calendar, official dates</div>
          <div className="flex flex-col gap-px bg-steel rounded-card overflow-hidden">
            {seasonCalendar.map((event) => (
              <div key={event.title} className="bg-carbon px-4 py-3.5">
                <div className="text-sm text-bone mb-0.5">{event.title}</div>
                <div className="text-xs text-smoke">
                  {event.date}
                  {event.location && ` · ${event.location}`}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-[#474747] mt-3">
            Source: ffboxe.com — calendrier national. Regional/club-level dates vary by ligue.
          </div>
        </>
      )}

      {state.campTab === "sparring" && (
        <>
          <div className="text-smoke text-sm py-6 pb-4">3 min work · 1 min rest · 6 rounds</div>
          <button
            onClick={api.openSparringTimer}
            className="w-full h-[52px] rounded-pill bg-fight-red text-pure-white text-[15px] font-semibold cursor-pointer"
          >
            START ROUND TIMER
          </button>
        </>
      )}

      <div onClick={api.openVideoReview} className="mt-2 text-[13px] font-semibold text-bone cursor-pointer">
        Open latest video review →
      </div>
    </div>
  );
}
