"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SparMark } from "@/components/spar/SparLogo";
import { unlockAudio, playSound } from "@/lib/timerAudio";

type Config = { work: number; rest: number; rounds: number; prep: number };
type PhaseKind = "prep" | "work" | "rest";
type Phase = { kind: PhaseKind; round: number; start: number; dur: number };

const DEFAULT_CONFIG: Config = { work: 180, rest: 60, rounds: 6, prep: 10 };
const STORAGE_KEY = "spar.minuteur.v1";

const PRESETS: { id: string; label: string; detail: string; cfg: Config }[] = [
  { id: "sparring", label: "Sparring", detail: "6 × 3 min", cfg: { work: 180, rest: 60, rounds: 6, prep: 10 } },
  { id: "amateur", label: "Amateur", detail: "3 × 3 min", cfg: { work: 180, rest: 60, rounds: 3, prep: 10 } },
  { id: "pro", label: "Pro", detail: "12 × 3 min", cfg: { work: 180, rest: 60, rounds: 12, prep: 10 } },
  { id: "debutant", label: "Débutant", detail: "5 × 2 min", cfg: { work: 120, rest: 60, rounds: 5, prep: 10 } },
  { id: "hiit", label: "HIIT", detail: "8 × 20 s", cfg: { work: 20, rest: 10, rounds: 8, prep: 10 } },
];

const sameConfig = (a: Config, b: Config) => a.work === b.work && a.rest === b.rest && a.rounds === b.rounds && a.prep === b.prep;

function clampConfig(c: Partial<Config>): Config {
  const num = (v: unknown, min: number, max: number, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;
  return {
    work: num(c.work, 10, 600, DEFAULT_CONFIG.work),
    rest: num(c.rest, 0, 300, DEFAULT_CONFIG.rest),
    rounds: num(c.rounds, 1, 20, DEFAULT_CONFIG.rounds),
    prep: num(c.prep, 0, 30, DEFAULT_CONFIG.prep),
  };
}

function buildPhases(c: Config): Phase[] {
  const phases: Phase[] = [];
  let t = 0;
  const push = (kind: PhaseKind, round: number, dur: number) => {
    if (dur <= 0) return;
    phases.push({ kind, round, start: t, dur });
    t += dur;
  };
  push("prep", 1, c.prep);
  for (let r = 1; r <= c.rounds; r++) {
    push("work", r, c.work);
    if (r < c.rounds) push("rest", r, c.rest);
  }
  return phases;
}

function locate(phases: Phase[], elapsedSec: number) {
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    if (elapsedSec < p.start + p.dur) return { idx: i, phase: p, into: elapsedSec - p.start };
  }
  return null;
}

const clock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function fmt(s: number) {
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m} min ${r} s` : `${m} min`;
}

/* ---------- small controls ---------- */
function Stepper({
  label,
  dot,
  value,
  onDec,
  onInc,
}: {
  label: string;
  dot: string;
  value: string;
  onDec: () => void;
  onInc: () => void;
}) {
  const btn =
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill border-none bg-graphite text-xl font-semibold text-bone transition-colors hover:bg-steel active:scale-95";
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} />
      <span className="flex-1 text-sm font-semibold tracking-wide text-mist">{label}</span>
      <button onClick={onDec} aria-label={`Diminuer ${label.toLowerCase()}`} className={btn}>
        −
      </button>
      <span className="w-[84px] text-center font-condensed text-3xl font-bold leading-none text-bone tabular-nums">{value}</span>
      <button onClick={onInc} aria-label={`Augmenter ${label.toLowerCase()}`} className={btn}>
        +
      </button>
    </div>
  );
}

const iconProps = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function SoundOnIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
      <path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" />
    </svg>
  );
}
function SoundOffIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </svg>
  );
}
function ExpandIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  );
}

type WakeLockLike = { release: () => Promise<void> };

export function Minuteur() {
  const [cfg, setCfg] = useState<Config>(DEFAULT_CONFIG);
  const [running, setRunning] = useState(false);
  const [baseMs, setBaseMs] = useState(0); // elapsed time before the current run segment
  const [now, setNow] = useState(0);
  const [startedAt, setStartedAt] = useState(0); // timestamp of the current run segment
  const [muted, setMuted] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const lastIdxRef = useRef(-1);
  const warnedRef = useRef(false);
  const wakeRef = useRef<WakeLockLike | null>(null);
  const baseTitleRef = useRef("");

  const phases = useMemo(() => buildPhases(cfg), [cfg]);
  const totalSec = phases.length ? phases[phases.length - 1].start + phases[phases.length - 1].dur : 0;

  // ---- saved settings -------------------------------------------------
  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setCfg(clampConfig(JSON.parse(raw)));
        setMuted(window.localStorage.getItem(`${STORAGE_KEY}.muted`) === "1");
      } catch {
        /* storage unavailable: defaults are fine */
      }
      setCanFullscreen(!!document.fullscreenEnabled);
      baseTitleRef.current = document.title;
    });
  }, []);

  function updateConfig(next: Config) {
    const safe = clampConfig(next);
    setCfg(safe);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    } catch {
      /* ignore */
    }
  }

  // ---- screen wake lock (the phone must not go to sleep mid-round) ----
  const acquireWake = useCallback(async () => {
    try {
      const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeLockLike> } };
      wakeRef.current = (await nav.wakeLock?.request("screen")) ?? null;
    } catch {
      wakeRef.current = null;
    }
  }, []);
  const releaseWake = useCallback(() => {
    void wakeRef.current?.release().catch(() => {});
    wakeRef.current = null;
  }, []);

  useEffect(() => {
    if (!running) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") void acquireWake();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [running, acquireWake]);

  useEffect(() => () => releaseWake(), [releaseWake]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ---- the clock: timestamp based, so it stays exact even if the tab is throttled ----
  const finish = useCallback(() => {
    setRunning(false);
    setBaseMs(totalSec * 1000);
    releaseWake();
  }, [totalSec, releaseWake]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const nowMs = Date.now();
      setNow(nowMs);
      const elapsed = (baseMs + nowMs - startedAt) / 1000;
      const loc = locate(phases, elapsed);
      const idx = loc ? loc.idx : phases.length;

      if (idx > lastIdxRef.current) {
        lastIdxRef.current = idx;
        warnedRef.current = false;
        if (!muted) playSound("bell");
      }
      if (loc && loc.phase.kind === "work" && loc.phase.dur > 10 && loc.phase.dur - loc.into <= 10 && !warnedRef.current) {
        warnedRef.current = true;
        if (!muted) playSound("warning");
      }
      if (!loc) finish();
    }, 100);
    return () => clearInterval(id);
  }, [running, baseMs, startedAt, phases, muted, finish]);

  const elapsedMs = running ? baseMs + Math.max(0, now - startedAt) : baseMs;
  const loc = locate(phases, elapsedMs / 1000);
  const finished = !loc && elapsedMs > 0;
  const idle = !running && elapsedMs === 0;

  // ---- what the screen shows ----
  let label = "PRÊT";
  let kind: PhaseKind | "ready" | "done" = "ready";
  let remaining = cfg.work;
  let round = 1;
  let progress = 0;
  if (finished) {
    label = "TERMINÉ";
    kind = "done";
    remaining = 0;
    round = cfg.rounds;
    progress = 1;
  } else if (loc && !idle) {
    kind = loc.phase.kind;
    label = kind === "prep" ? "PRÉPARE-TOI" : kind === "work" ? "TRAVAIL" : "REPOS";
    remaining = Math.ceil(loc.phase.dur - loc.into);
    round = loc.phase.round;
    progress = loc.into / loc.phase.dur;
  }
  const warning = kind === "work" && remaining <= 10 && cfg.work > 10 && running;

  const labelColor = kind === "rest" ? "text-warning" : kind === "prep" ? "text-mist" : kind === "done" ? "text-success" : "text-bone";
  const barColor = kind === "rest" ? "bg-warning" : kind === "prep" ? "bg-mist" : kind === "done" ? "bg-success" : "bg-fight-red";

  // ---- title in the tab while running ----
  useEffect(() => {
    if (!running) return;
    document.title = `${clock(remaining)} · Round ${round}/${cfg.rounds} · Spar`;
    return () => {
      if (baseTitleRef.current) document.title = baseTitleRef.current;
    };
  }, [running, remaining, round, cfg.rounds]);

  // ---- actions ----
  const reset = useCallback(() => {
    setRunning(false);
    setBaseMs(0);
    lastIdxRef.current = -1;
    warnedRef.current = false;
    releaseWake();
  }, [releaseWake]);

  const toggle = useCallback(() => {
    if (running) {
      setBaseMs(baseMs + (Date.now() - startedAt));
      setRunning(false);
      releaseWake();
      return;
    }
    let from = baseMs;
    if (finished) {
      from = 0;
      lastIdxRef.current = -1;
    }
    const startIdx = locate(phases, from / 1000)?.idx ?? 0;
    const startingFresh = from === 0;
    if (startingFresh) lastIdxRef.current = startIdx;
    warnedRef.current = false;
    setBaseMs(from);
    const t0 = Date.now();
    setStartedAt(t0);
    setNow(t0);
    setRunning(true);
    void acquireWake();
    void unlockAudio().then(() => {
      if (startingFresh && phases[startIdx]?.kind === "work" && !muted) playSound("bell");
    });
  }, [running, baseMs, startedAt, finished, phases, muted, acquireWake, releaseWake]);

  const skip = useCallback(() => {
    if (idle || finished) return;
    const current = locate(phases, elapsedMs / 1000);
    if (!current) return;
    const next = phases[current.idx + 1];
    if (!next) {
      finish();
      if (!muted) playSound("bell");
      return;
    }
    const t0 = Date.now();
    setBaseMs(next.start * 1000);
    setStartedAt(t0);
    setNow(t0);
    lastIdxRef.current = current.idx + 1;
    warnedRef.current = false;
    if (!muted) playSound("bell");
  }, [idle, finished, phases, elapsedMs, finish, muted]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      try {
        window.localStorage.setItem(`${STORAGE_KEY}.muted`, m ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !m;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.key === "r" || e.key === "R") reset();
      else if (e.key === "ArrowRight") skip();
      else if (e.key === "f" || e.key === "F") toggleFullscreen();
      else if (e.key === "m" || e.key === "M") toggleMute();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, reset, skip, toggleFullscreen, toggleMute]);

  const mainLabel = running ? "PAUSE" : finished ? "RECOMMENCER" : idle ? "DÉMARRER" : "REPRENDRE";
  const activePreset = PRESETS.find((p) => sameConfig(p.cfg, cfg))?.id;
  const stepOf = (v: number) => (v < 60 ? 5 : 15);

  const iconBtn =
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill border border-steel bg-transparent text-mist transition-colors hover:text-bone";

  return (
    <div className="relative flex min-h-[100svh] flex-col bg-obsidian">
      {/* phase progress */}
      <div className="absolute inset-x-0 top-0 h-1 bg-graphite" aria-hidden>
        <div className={`h-full ${barColor} transition-[width] duration-100 ease-linear`} style={{ width: `${Math.min(100, progress * 100)}%` }} />
      </div>

      <header className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-bone hover:text-bone">
          <SparMark size={26} />
          <span className="font-condensed text-2xl font-bold tracking-wide">SPAR</span>
          <span className="hidden text-sm font-medium text-smoke sm:inline">· Minuteur</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <button onClick={toggleMute} aria-label={muted ? "Activer le son" : "Couper le son"} aria-pressed={muted} className={iconBtn}>
            {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          </button>
          {canFullscreen && (
            <button onClick={toggleFullscreen} aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"} className={iconBtn}>
              <ExpandIcon />
            </button>
          )}
          <Link
            href="/app/spar/find"
            className="ml-1 hidden h-11 items-center rounded-pill bg-bone px-5 text-sm font-semibold text-obsidian transition-transform hover:scale-[1.03] hover:bg-pure-white hover:text-obsidian md:inline-flex"
          >
            Trouver un sparring
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col lg:flex-row">
        {/* clock */}
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-6 text-center" aria-live="off">
          <div className={`mb-2 text-sm font-bold tracking-[0.18em] md:text-base ${labelColor}`}>{label}</div>
          <div
            role="timer"
            aria-label={`${label} ${clock(remaining)}`}
            className={`font-condensed text-[clamp(7.5rem,34vw,22rem)] font-bold leading-[0.85] tracking-tight tabular-nums transition-colors lg:text-[clamp(10rem,22vw,22rem)] ${
              warning ? "animate-pulse text-fight-red" : kind === "done" ? "text-success" : "text-bone"
            }`}
          >
            {clock(remaining)}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="text-sm font-semibold tracking-[0.12em] text-mist">
              ROUND {round} / {cfg.rounds}
            </div>
            <div className="flex gap-1.5" aria-hidden>
              {Array.from({ length: cfg.rounds }, (_, i) => {
                const n = i + 1;
                const done = finished || n < round;
                const current = !finished && n === round && !idle;
                return (
                  <span
                    key={n}
                    className={`h-1.5 w-7 rounded-full md:w-9 ${
                      done ? "bg-bone" : current ? (kind === "rest" ? "bg-warning" : "bg-fight-red") : "bg-steel"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* settings, only when nothing is running */}
        {idle && (
          <aside className="w-full border-steel px-6 pb-6 lg:w-[400px] lg:border-l lg:py-10 lg:pl-10 lg:pr-0">
            <div className="mb-3 text-xs font-semibold tracking-[0.12em] text-smoke">PRÉRÉGLAGES</div>
            <div className="mb-6 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => updateConfig(p.cfg)}
                  aria-pressed={activePreset === p.id}
                  className={`flex cursor-pointer flex-col items-start rounded-card border px-4 py-2.5 text-left transition-colors ${
                    activePreset === p.id ? "border-bone bg-carbon" : "border-steel bg-transparent hover:border-smoke"
                  }`}
                >
                  <span className="text-sm font-semibold text-bone">{p.label}</span>
                  <span className="text-xs text-smoke">{p.detail}</span>
                </button>
              ))}
            </div>

            <div className="mb-1 text-xs font-semibold tracking-[0.12em] text-smoke">RÉGLAGES</div>
            <div className="divide-y divide-steel">
              <Stepper
                label="TRAVAIL"
                dot="#E31B23"
                value={fmt(cfg.work)}
                onDec={() => updateConfig({ ...cfg, work: cfg.work - stepOf(cfg.work - 1) })}
                onInc={() => updateConfig({ ...cfg, work: cfg.work + stepOf(cfg.work) })}
              />
              <Stepper
                label="REPOS"
                dot="#FFB020"
                value={cfg.rest === 0 ? "aucun" : fmt(cfg.rest)}
                onDec={() => updateConfig({ ...cfg, rest: cfg.rest - stepOf(cfg.rest - 1) })}
                onInc={() => updateConfig({ ...cfg, rest: cfg.rest + stepOf(cfg.rest) })}
              />
              <Stepper
                label="ROUNDS"
                dot="#4C8DFF"
                value={String(cfg.rounds)}
                onDec={() => updateConfig({ ...cfg, rounds: cfg.rounds - 1 })}
                onInc={() => updateConfig({ ...cfg, rounds: cfg.rounds + 1 })}
              />
              <Stepper
                label="PRÉPARATION"
                dot="#B7B7B7"
                value={cfg.prep === 0 ? "aucune" : `${cfg.prep} s`}
                onDec={() => updateConfig({ ...cfg, prep: cfg.prep - 5 })}
                onInc={() => updateConfig({ ...cfg, prep: cfg.prep + 5 })}
              />
            </div>
            <p className="mt-4 text-xs leading-5 text-smoke">
              Durée totale : {fmt(totalSec)}. Tes réglages sont gardés pour la prochaine fois.
            </p>
          </aside>
        )}
      </main>

      {/* controls */}
      <div className="sticky bottom-0 z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-3 bg-gradient-to-t from-obsidian via-obsidian/95 to-transparent px-6 pb-8 pt-6 md:px-10">
        <div className="flex w-full max-w-[560px] items-center gap-3">
          <button
            onClick={reset}
            disabled={idle}
            aria-label="Remettre à zéro"
            className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-graphite text-xs font-semibold text-bone transition-opacity disabled:cursor-default disabled:opacity-35"
          >
            RESET
          </button>
          <button
            onClick={toggle}
            className="h-14 flex-1 cursor-pointer rounded-pill border-none bg-bone text-[15px] font-bold tracking-[0.06em] text-obsidian transition-transform hover:bg-pure-white active:scale-[0.98]"
          >
            {mainLabel}
          </button>
          <button
            onClick={skip}
            disabled={idle || finished}
            aria-label="Passer à la phase suivante"
            className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-graphite text-lg font-semibold text-bone transition-opacity disabled:cursor-default disabled:opacity-35"
          >
            ›|
          </button>
        </div>
        <p className="hidden text-xs text-smoke md:block">
          Espace : démarrer / pause · R : remettre à zéro · → : phase suivante · F : plein écran · M : son
        </p>
      </div>
    </div>
  );
}
