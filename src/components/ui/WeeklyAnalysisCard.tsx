import type { WeeklyAnalysis } from "@/lib/weeklyAnalysis";

const TONE_COLOR: Record<WeeklyAnalysis["tone"], string> = {
  good: "#30D158",
  warning: "#FFB020",
  neutral: "#767676",
};

export function WeeklyAnalysisCard({ analysis }: { analysis: WeeklyAnalysis }) {
  return (
    <div className="bg-carbon rounded-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TONE_COLOR[analysis.tone] }} />
        <span className="text-xs font-semibold tracking-[0.05em] text-smoke uppercase">Analyse de la semaine</span>
      </div>
      <div className="text-[15px] text-bone mb-4">{analysis.verdict}</div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="font-condensed text-2xl font-bold text-bone">{analysis.completedCount}</div>
          <div className="text-[11px] text-smoke">Séances</div>
        </div>
        <div>
          <div className="font-condensed text-2xl font-bold text-bone">{analysis.sparringCount}</div>
          <div className="text-[11px] text-smoke">Sparring</div>
        </div>
        <div>
          <div className="font-condensed text-2xl font-bold text-bone">{analysis.recoveryCount}</div>
          <div className="text-[11px] text-smoke">Récup.</div>
        </div>
      </div>
      {(analysis.avgEnergy !== null || analysis.avgDifficulty !== null) && (
        <div className="text-[12px] text-smoke mt-4 pt-3 border-t border-steel">
          {analysis.avgEnergy !== null && <span>Énergie moy. {analysis.avgEnergy.toFixed(1)}/5</span>}
          {analysis.avgEnergy !== null && analysis.avgDifficulty !== null && <span> · </span>}
          {analysis.avgDifficulty !== null && <span>Difficulté moy. {analysis.avgDifficulty.toFixed(1)}/5</span>}
        </div>
      )}
    </div>
  );
}
