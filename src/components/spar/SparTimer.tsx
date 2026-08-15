"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons/Icon";
import { playBell, playWarning } from "@/lib/timerSounds";

const ROUND_MIN = 1;
const ROUND_MAX = 12;
const WORK_STEP = 15;
const WORK_MIN = 30;
const WORK_MAX = 300;
const REST_STEP = 15;
const REST_MIN = 15;
const REST_MAX = 180;
const PIXELS_PER_STEP = 18;

type FieldKey = "work" | "rest" | "rounds";

const FIELDS: Record<FieldKey, { label: string; description: string; dot: string }> = {
  work: { label: "TRAVAIL", description: "Durée d'un round de travail", dot: "#E31B23" },
  rest: { label: "REPOS", description: "Pause entre deux rounds", dot: "#FFB020" },
  rounds: { label: "ROUNDS", description: "Nombre de rounds à enchaîner", dot: "#4C8DFF" },
};

function formatClock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function SettingsRow({
  field,
  display,
  onPress,
  isLast,
}: {
  field: FieldKey;
  display: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  const meta = FIELDS[field];
  return (
    <button
      onClick={onPress}
      className={`w-full flex items-center gap-3.5 py-4 bg-transparent border-none border-x-0 border-t-0 cursor-pointer text-left ${
        isLast ? "" : "border-b border-steel"
      }`}
    >
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: meta.dot }} />
      <span className="flex-1">
        <span className="block text-bone font-semibold text-[15px]">{meta.label}</span>
        <span className="block text-smoke text-xs mt-0.5">{meta.description}</span>
      </span>
      <span className="font-condensed text-2xl font-bold text-bone mr-1">{display}</span>
      <ChevronRightIcon size={16} className="text-smoke" />
    </button>
  );
}

function AdjustSheet({
  field,
  display,
  onDecrement,
  onIncrement,
  onClose,
}: {
  field: FieldKey | null;
  display: string;
  onDecrement: () => void;
  onIncrement: () => void;
  onClose: () => void;
}) {
  const [active, setActive] = useState(false);
  const startYRef = useRef(0);
  const accumRef = useRef(0);

  if (!field) return null;
  const meta = FIELDS[field];

  function handlePointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    startYRef.current = e.clientY;
    accumRef.current = 0;
    setActive(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!active) return;
    const dy = startYRef.current - e.clientY;
    const totalSteps = Math.trunc(dy / PIXELS_PER_STEP);
    const delta = totalSteps - accumRef.current;
    if (delta > 0) {
      for (let i = 0; i < delta; i++) onIncrement();
      accumRef.current = totalSteps;
    } else if (delta < 0) {
      for (let i = 0; i < -delta; i++) onDecrement();
      accumRef.current = totalSteps;
    }
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-[100] flex items-end" style={{ background: "rgba(0,0,0,.65)" }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-auto bg-carbon rounded-t-[24px] px-6 pt-4 pb-11 flex flex-col items-center"
      >
        <div className="w-9 h-1 bg-steel rounded-full mb-5" />
        <div className="text-[12px] font-semibold tracking-[0.05em] text-smoke mb-5">{meta.label}</div>

        <button
          onClick={onIncrement}
          className="w-14 h-10 flex items-center justify-center bg-transparent border-none cursor-pointer text-smoke text-lg"
        >
          ▲
        </button>

        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={() => setActive(false)}
          className={`w-[220px] h-[120px] rounded-lg flex flex-col items-center justify-center my-1 cursor-ns-resize select-none touch-none ${
            active ? "bg-steel" : "bg-graphite"
          }`}
        >
          <div className="font-condensed text-5xl font-bold text-bone">{display}</div>
          <div className="text-[11px] text-smoke mt-1">glisse ou utilise les flèches</div>
        </div>

        <button
          onClick={onDecrement}
          className="w-14 h-10 flex items-center justify-center bg-transparent border-none cursor-pointer text-smoke text-lg"
        >
          ▼
        </button>

        <button
          onClick={onClose}
          className="mt-5 h-12 px-10 rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export function SparTimer() {
  const router = useRouter();
  const [totalRounds, setTotalRounds] = useState(6);
  const [workSeconds, setWorkSeconds] = useState(180);
  const [restSeconds, setRestSeconds] = useState(60);
  const [activeField, setActiveField] = useState<FieldKey | null>(null);

  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);
  const [isRest, setIsRest] = useState(false);
  const [seconds, setSeconds] = useState(workSeconds);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) {
          if (s - 1 === 10 && !warnedRef.current) {
            warnedRef.current = true;
            playWarning();
          }
          return s - 1;
        }
        if (!isRest) {
          if (round >= totalRounds) {
            setRunning(false);
            playBell();
            return 0;
          }
          setIsRest(true);
          warnedRef.current = false;
          playBell();
          return restSeconds;
        }
        setIsRest(false);
        setRound((r) => r + 1);
        warnedRef.current = false;
        playBell();
        return workSeconds;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, isRest, round, totalRounds, workSeconds, restSeconds]);

  function reset() {
    setRunning(false);
    setRound(1);
    setIsRest(false);
    setSeconds(workSeconds);
    warnedRef.current = false;
  }

  function toggle() {
    if (running) {
      setRunning(false);
      return;
    }
    if (seconds > 0 || round < totalRounds) {
      warnedRef.current = false;
      playBell();
      setRunning(true);
    }
  }

  function adjustWork(next: number) {
    setWorkSeconds(next);
    if (!isRest && seconds === workSeconds) setSeconds(next);
  }

  const display = formatClock(seconds);
  const buttonLabel = running ? "PAUSE" : seconds === 0 ? "TERMINÉ" : "DÉMARRER";
  const canConfigure = !running;

  const fieldHandlers: Record<FieldKey, { display: string; onDecrement: () => void; onIncrement: () => void }> = {
    work: {
      display: formatClock(workSeconds),
      onDecrement: () => adjustWork(Math.max(WORK_MIN, workSeconds - WORK_STEP)),
      onIncrement: () => adjustWork(Math.min(WORK_MAX, workSeconds + WORK_STEP)),
    },
    rest: {
      display: formatClock(restSeconds),
      onDecrement: () => setRestSeconds((r) => Math.max(REST_MIN, r - REST_STEP)),
      onIncrement: () => setRestSeconds((r) => Math.min(REST_MAX, r + REST_STEP)),
    },
    rounds: {
      display: String(totalRounds),
      onDecrement: () => setTotalRounds((r) => Math.max(ROUND_MIN, r - 1)),
      onIncrement: () => setTotalRounds((r) => Math.min(ROUND_MAX, r + 1)),
    },
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col max-w-md mx-auto">
      <div className="px-5 pt-16 pb-5 flex items-center gap-4">
        <button
          onClick={() => {
            reset();
            router.back();
          }}
          className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone"
        >
          <ChevronLeftIcon />
        </button>
        <div className="text-[17px] font-semibold text-bone">Minuteur de sparring</div>
      </div>

      <div className="flex flex-col items-center py-5 gap-1.5">
        <div className="text-[13px] font-bold tracking-[0.08em]" style={{ color: isRest ? "#FFB020" : "#F5F3EE" }}>
          {isRest ? "REPOS" : "TRAVAIL"}
        </div>
        <div className="font-condensed text-[80px] leading-[80px] font-bold text-bone">{display}</div>
        <div className="text-sm text-smoke">
          ROUND {round} / {totalRounds}
        </div>
      </div>

      {canConfigure && (
        <div className="px-5">
          <SettingsRow field="work" display={fieldHandlers.work.display} onPress={() => setActiveField("work")} />
          <SettingsRow field="rest" display={fieldHandlers.rest.display} onPress={() => setActiveField("rest")} />
          <SettingsRow field="rounds" display={fieldHandlers.rounds.display} onPress={() => setActiveField("rounds")} isLast />
        </div>
      )}

      <div className="flex-1" />

      <div className="px-8 pb-12 pt-6 flex gap-4">
        <button
          onClick={reset}
          className="w-14 h-14 rounded-full bg-graphite border-none text-bone text-xs font-semibold cursor-pointer"
        >
          RESET
        </button>
        <button
          onClick={toggle}
          className="flex-1 h-14 rounded-pill bg-bone text-obsidian text-[15px] font-bold tracking-[0.04em] cursor-pointer"
        >
          {buttonLabel}
        </button>
      </div>

      <AdjustSheet
        field={activeField}
        display={activeField ? fieldHandlers[activeField].display : ""}
        onDecrement={() => activeField && fieldHandlers[activeField].onDecrement()}
        onIncrement={() => activeField && fieldHandlers[activeField].onIncrement()}
        onClose={() => setActiveField(null)}
      />
    </div>
  );
}
