export type Screen =
  | "loading"
  | "onboarding"
  | "login"
  | "app"
  | "sessionDetail"
  | "sparringTimer"
  | "videoReview";

export type Tab = "home" | "camp" | "team" | "passport";
export type CampTab = "overview" | "schedule" | "sparring";
export type Stance = "ORTHODOX" | "SOUTHPAW";

export interface Session {
  id: string;
  time: string;
  title: string;
  sub: string;
  completed: boolean;
  sessionType: string;
  durationMinutes: number | null;
  objective: string | null;
  scheduledFor: string;
  energy: number | null;
  difficulty: number | null;
}

export interface Camp {
  id: string;
  opponentName: string;
  fightDate: string | null;
  weekCurrent: number;
  weekTotal: number;
  objectives: string[];
}

export interface TimerState {
  running: boolean;
  round: number;
  totalRounds: number;
  isRest: boolean;
  workSeconds: number;
  restSeconds: number;
  seconds: number;
}

export interface BoxerState {
  screen: Screen;
  onboardStep: 0 | 1 | 2 | 3;
  activeTab: Tab;
  campTab: CampTab;
  activeSessionId: string | null;
  sessionPhase: "detail" | "during";
  showAddSheet: boolean;
  showCompleteSheet: boolean;
  toast: string | null;
  authError: string | null;
  authSubmitting: boolean;
  // draft fields used during the onboarding wizard, before the account exists
  firstName: string;
  lastName: string;
  weight: string;
  stance: Stance;
  clubCode: string;
  email: string;
  password: string;
  // populated once signed in
  userId: string | null;
  coachName: string | null;
  wins: number;
  losses: number;
  photoUrl: string | null;
  camp: Camp | null;
  energy: number;
  difficulty: number;
  sessions: Session[];
  activeMarker: number;
  timer: TimerState;
}

export const INITIAL_TIMER: TimerState = {
  running: false,
  round: 1,
  totalRounds: 6,
  isRest: false,
  workSeconds: 180,
  restSeconds: 60,
  seconds: 180,
};

export const INITIAL_STATE: BoxerState = {
  screen: "loading",
  onboardStep: 0,
  activeTab: "home",
  campTab: "overview",
  activeSessionId: null,
  sessionPhase: "detail",
  showAddSheet: false,
  showCompleteSheet: false,
  toast: null,
  authError: null,
  authSubmitting: false,
  firstName: "",
  lastName: "",
  weight: "71",
  stance: "ORTHODOX",
  clubCode: "",
  email: "",
  password: "",
  userId: null,
  coachName: null,
  wins: 0,
  losses: 0,
  photoUrl: null,
  camp: null,
  energy: 0,
  difficulty: 0,
  sessions: [],
  activeMarker: 0,
  timer: INITIAL_TIMER,
};
