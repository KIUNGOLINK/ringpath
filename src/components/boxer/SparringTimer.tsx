import { ChevronLeftIcon } from "@/components/icons/Icon";
import type { BoxerAppApi } from "./useBoxerApp";

const ROUND_MIN = 1;
const ROUND_MAX = 12;
const WORK_STEP = 15;
const WORK_MIN = 30;
const WORK_MAX = 300;
const REST_STEP = 15;
const REST_MIN = 15;
const REST_MAX = 180;

function formatClock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function Stepper({
  label,
  display,
  onDecrement,
  onIncrement,
}: {
  label: string;
  display: string;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[11px] tracking-[0.06em] text-smoke">{label}</div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={onDecrement}
          className="w-8 h-8 rounded-full bg-graphite border-none text-bone cursor-pointer flex items-center justify-center"
        >
          −
        </button>
        <div className="font-condensed text-2xl font-bold text-bone w-14 text-center">{display}</div>
        <button
          onClick={onIncrement}
          className="w-8 h-8 rounded-full bg-graphite border-none text-bone cursor-pointer flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function SparringTimer({ api }: { api: BoxerAppApi }) {
  const { timer } = api.state;
  const display = formatClock(timer.seconds);
  const buttonLabel = timer.running ? "PAUSE" : timer.seconds === 0 ? "TERMINÉ" : "DÉMARRER";
  const configuring = !timer.running && timer.round === 1 && !timer.isRest && timer.seconds === timer.workSeconds;

  return (
    <div className="absolute inset-0 bg-obsidian flex flex-col">
      <div className="px-5 pt-16 pb-5 flex items-center gap-4">
        <button
          onClick={api.closeSparringTimer}
          className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone"
        >
          <ChevronLeftIcon />
        </button>
        <div className="text-[17px] font-semibold text-bone">Minuteur de sparring</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div
          className="text-[13px] font-bold tracking-[0.08em]"
          style={{ color: timer.isRest ? "#FFB020" : "#F5F3EE" }}
        >
          {timer.isRest ? "REPOS" : "TRAVAIL"}
        </div>
        <div className="font-condensed text-[110px] leading-[100px] font-bold text-bone">{display}</div>
        <div className="text-sm text-smoke">
          ROUND {timer.round} / {timer.totalRounds}
        </div>

        {configuring && (
          <div className="flex gap-7 mt-2">
            <Stepper
              label="ROUNDS"
              display={String(timer.totalRounds)}
              onDecrement={() => api.setTimerRounds(Math.max(ROUND_MIN, timer.totalRounds - 1))}
              onIncrement={() => api.setTimerRounds(Math.min(ROUND_MAX, timer.totalRounds + 1))}
            />
            <Stepper
              label="TRAVAIL"
              display={formatClock(timer.workSeconds)}
              onDecrement={() => api.setTimerWork(Math.max(WORK_MIN, timer.workSeconds - WORK_STEP))}
              onIncrement={() => api.setTimerWork(Math.min(WORK_MAX, timer.workSeconds + WORK_STEP))}
            />
            <Stepper
              label="REPOS"
              display={formatClock(timer.restSeconds)}
              onDecrement={() => api.setTimerRest(Math.max(REST_MIN, timer.restSeconds - REST_STEP))}
              onIncrement={() => api.setTimerRest(Math.min(REST_MAX, timer.restSeconds + REST_STEP))}
            />
          </div>
        )}
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
