export type WeeklySession = {
  scheduledFor: string;
  completed: boolean;
  sessionType: string;
  energy: number | null;
  difficulty: number | null;
};

export type WeeklyAnalysis = {
  completedCount: number;
  sparringCount: number;
  recoveryCount: number;
  avgEnergy: number | null;
  avgDifficulty: number | null;
  verdict: string;
  tone: "good" | "warning" | "neutral";
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function analyzeWeek(sessions: WeeklySession[], daysUntilFight: number | null): WeeklyAnalysis {
  const now = Date.now();
  const thisWeek = sessions.filter((s) => s.completed && now - new Date(s.scheduledFor).getTime() <= WEEK_MS);

  const completedCount = thisWeek.length;
  const sparringCount = thisWeek.filter((s) => s.sessionType === "Sparring").length;
  const recoveryCount = thisWeek.filter((s) => s.sessionType === "Recovery").length;

  const energyValues = thisWeek.map((s) => s.energy).filter((v): v is number => v != null);
  const difficultyValues = thisWeek.map((s) => s.difficulty).filter((v): v is number => v != null);
  const avgEnergy = energyValues.length ? energyValues.reduce((a, b) => a + b, 0) / energyValues.length : null;
  const avgDifficulty = difficultyValues.length
    ? difficultyValues.reduce((a, b) => a + b, 0) / difficultyValues.length
    : null;

  let verdict: string;
  let tone: WeeklyAnalysis["tone"];

  if (completedCount === 0) {
    verdict = "Aucune séance enregistrée cette semaine.";
    tone = "neutral";
  } else if (completedCount < 3) {
    verdict = "Charge faible cette semaine — peu de séances enregistrées.";
    tone = "warning";
  } else if (daysUntilFight !== null && daysUntilFight <= 21 && sparringCount === 0) {
    verdict = "Aucun sparring cette semaine alors que le combat approche.";
    tone = "warning";
  } else if (completedCount >= 5 && recoveryCount === 0) {
    verdict = "Bon volume, mais aucune récupération — attention à la fatigue.";
    tone = "warning";
  } else if (avgDifficulty !== null && avgDifficulty >= 4.5 && recoveryCount === 0) {
    verdict = "Difficulté ressentie élevée sans récupération cette semaine.";
    tone = "warning";
  } else {
    verdict = "Charge d'entraînement équilibrée cette semaine.";
    tone = "good";
  }

  return { completedCount, sparringCount, recoveryCount, avgEnergy, avgDifficulty, verdict, tone };
}
