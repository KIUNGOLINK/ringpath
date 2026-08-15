import { ChevronLeftIcon } from "@/components/icons/Icon";
import { sessionLibrary } from "@/data/mock";
import type { BoxerAppApi } from "./useBoxerApp";

export function SessionDetail({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  const session = state.sessions.find((s) => s.id === state.activeSessionId);

  return (
    <div className="absolute inset-0 bg-obsidian px-5 pt-16 pb-32 overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={api.closeSession}
          className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone"
        >
          <ChevronLeftIcon />
        </button>
        <div className="text-[17px] font-semibold text-bone">{session?.title}</div>
      </div>

      <div className="text-[11px] font-semibold tracking-[0.05em] text-smoke mb-2">
        AUJOURD&rsquo;HUI {session?.time}
      </div>
      <div className="text-sm text-mist mb-6">
        {session?.durationMinutes ? `Durée : ${session.durationMinutes} min` : "Durée non définie"}
      </div>

      <div className="text-xs font-semibold tracking-[0.05em] text-smoke mb-2">OBJECTIF</div>
      <div className="text-base text-bone mb-8">
        {session?.objective || "Aucun objectif défini pour cette séance."}
      </div>

      <div className="text-xs font-semibold tracking-[0.05em] text-smoke mb-3">SÉANCE</div>
      <div className="flex flex-col gap-px bg-steel rounded-card overflow-hidden mb-8">
        {sessionLibrary.map((item) => (
          <div key={item.label} className="bg-carbon px-4 py-3.5 flex justify-between text-sm text-bone">
            <span>{item.label}</span>
            <span className="text-smoke">{item.detail}</span>
          </div>
        ))}
      </div>

      <div
        className="absolute left-0 right-0 bottom-0 px-5 py-4"
        style={{ background: "linear-gradient(to top, #070707 60%, transparent)" }}
      >
        <button
          onClick={api.startOrComplete}
          className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer"
        >
          {state.sessionPhase === "detail" ? "COMMENCER LA SÉANCE" : "Terminer la séance"}
        </button>
      </div>
    </div>
  );
}
