import type { BoxerAppApi } from "./useBoxerApp";

function Dots({ value, onSelect }: { value: number; onSelect: (n: number) => void }) {
  return (
    <div className="flex gap-2.5 mb-6 last:mb-8">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onSelect(n)}
          aria-label={`${n} of 5`}
          className="w-8 h-8 rounded-full border-none cursor-pointer"
          style={{ background: n <= value ? "#F5F3EE" : "#292929" }}
        />
      ))}
    </div>
  );
}

export function CompleteSheet({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  return (
    <div className="absolute inset-0 z-[100] flex items-end" style={{ background: "rgba(0,0,0,.6)" }}>
      <div className="w-full bg-carbon rounded-t-[24px] px-5 pt-3 pb-8">
        <div className="w-9 h-1 bg-steel rounded-full mx-auto mb-6" />
        <div className="text-xl font-bold text-bone mb-6">HOW DID IT FEEL?</div>
        <div className="text-[13px] text-smoke mb-2.5">Energy</div>
        <Dots value={state.energy} onSelect={api.setEnergy} />
        <div className="text-[13px] text-smoke mb-2.5">Difficulty</div>
        <Dots value={state.difficulty} onSelect={api.setDifficulty} />
        <button
          onClick={api.finishSession}
          className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
