import { ChevronLeftIcon } from "@/components/icons/Icon";
import type { BoxerAppApi } from "./useBoxerApp";

export function SparringTimer({ api }: { api: BoxerAppApi }) {
  const { timer } = api.state;
  const display = `${Math.floor(timer.seconds / 60)}:${String(timer.seconds % 60).padStart(2, "0")}`;
  const buttonLabel = timer.running ? "PAUSE" : timer.seconds === 0 ? "DONE" : "START";

  return (
    <div className="absolute inset-0 bg-obsidian flex flex-col">
      <div className="px-5 pt-16 pb-5 flex items-center gap-4">
        <button
          onClick={api.closeSparringTimer}
          className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone"
        >
          <ChevronLeftIcon />
        </button>
        <div className="text-[17px] font-semibold text-bone">Sparring Timer</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div
          className="text-[13px] font-bold tracking-[0.08em]"
          style={{ color: timer.isRest ? "#FFB020" : "#F5F3EE" }}
        >
          {timer.isRest ? "REST" : "WORK"}
        </div>
        <div className="font-condensed text-[110px] leading-[100px] font-bold text-bone">{display}</div>
        <div className="text-sm text-smoke">
          ROUND {timer.round} / {timer.totalRounds}
        </div>
      </div>

      <div className="px-8 pb-12 pt-6 flex gap-4">
        <button
          onClick={api.resetTimer}
          className="w-14 h-14 rounded-full bg-graphite border-none text-bone text-xs font-semibold cursor-pointer"
        >
          RESET
        </button>
        <button
          onClick={api.toggleTimer}
          className="flex-1 h-14 rounded-pill bg-bone text-obsidian text-[15px] font-bold tracking-[0.04em] cursor-pointer"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
