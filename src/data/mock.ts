export const boxerHome = {
  name: "Yanis",
  nextFight: {
    opponent: "Malik D.",
    fighterA: "Yanis K.",
    daysOut: 37,
    weight: "71 KG",
    date: "20 SEP",
  },
  today: [
    { time: "18:00", title: "Technical Boxing", detail: "Footwork · 75 min", status: "active" as const },
    { time: "06:30", title: "Roadwork", detail: "06:30 · 40 min", status: "completed" as const },
  ],
  coachNote: { coach: "Coach Sofia", note: "Stay behind your jab today." },
  latestReview: { label: "SPARRING · YESTERDAY", title: "4 new coach notes" },
};

export const camp = {
  fighterA: "YANIS",
  fighterB: "MALIK",
  daysOut: 37,
  progressPct: 52,
  week: { current: 4, total: 8 },
  stats: [
    { label: "Sessions", value: 24 },
    { label: "Rounds", value: 82 },
    { label: "Sparring", value: 26 },
    { label: "Recovery", value: 4 },
  ],
  objectives: [
    "Exit left after combinations.",
    "Increase jab volume.",
    "Body defence.",
  ],
};

export const videoAnnotations = [
  { position: 12, type: "good" as const },
  { position: 38, type: "improve" as const },
  { position: 61, type: "mistake" as const },
  { position: 80, type: "tactical" as const },
];

export const videoActiveAnnotation = {
  timestamp: "04:47",
  type: "improve" as const,
  coach: "Coach Sofia",
  note: "You're staying directly in front after the combination.",
  progressPct: 38,
};

export const fighterPassport = {
  handle: "ringpath.com/yanis-kader",
  firstName: "YANIS",
  lastName: "KADER",
  age: 23,
  weight: "71 KG",
  stance: "ORTHODOX",
  location: "PARIS, FRANCE",
  record: "16–3",
  recordLabel: "Amateur Record",
  achievements: [
    { year: 2026, title: "Paris Regional Champion" },
    { year: 2025, title: "National Tournament — Quarter Final" },
  ],
  fullFight: {
    opponent: "Diallo T.",
    event: "National Championships · 2026 · 8:12",
  },
  timeline: [
    { year: 2023, title: "First Bout" },
    { year: 2024, title: "10th Amateur Fight" },
    { year: 2025, title: "Regional Finalist" },
    { year: 2026, title: "Regional Champion", highlight: true },
  ],
  trust: [
    { label: "Identity", status: "verified" as const },
    { label: "Coach", status: "verified" as const },
    { label: "Club", status: "confirmed" as const },
    { label: "Record", status: "confirmed" as const },
    { label: "Achievements", status: "pending" as const, note: "2 verified / 1 pending" },
  ],
};

export const coachDashboard = {
  name: "SOFIA",
  fighterCount: 12,
  activeCamps: 3,
  today: [
    { time: "18:00", detail: "Yanis — Technical" },
    { time: "19:00", detail: "Camille — Sparring" },
    { time: "20:00", detail: "Adam — Pads" },
  ],
  camps: [
    { name: "Yanis", weight: "71 KG", daysOut: 37, week: { current: 4, total: 8 }, progressPct: 50 },
    { name: "Camille", weight: "63.5 KG", daysOut: 12, week: { current: 6, total: 8 }, progressPct: 75 },
  ],
  alerts: [
    { label: "REVIEW READY", color: "#4C8DFF", text: "Yanis uploaded sparring footage." },
    { label: "CAMP UPDATE", color: "#FFB020", text: "Fight date changed." },
  ],
  roster: [
    { name: "Yanis Kader", weight: "71 KG", status: "Active Camp", statusColor: "#30D158", nextFight: "20 Sep", lastSession: "Today" },
    { name: "Camille Roy", weight: "63.5 KG", status: "Active Camp", statusColor: "#30D158", nextFight: "26 Aug", lastSession: "Yesterday" },
    { name: "Adam Reyes", weight: "69 KG", status: "Off camp", statusColor: "#767676", nextFight: "—", lastSession: "3 days ago" },
  ],
};

export const scoutingFighters = [
  {
    name: "Yanis Kader",
    country: "France",
    age: 23,
    weight: "71kg",
    stance: "Orthodox",
    record: "16–3",
    verification: { text: "Coach confirmed", color: "#2E6BD6" },
  },
  {
    name: "Camille Roy",
    country: "France",
    age: 20,
    weight: "63.5kg",
    stance: "Southpaw",
    record: "11–2",
    verification: { text: "Coach confirmed", color: "#2E6BD6" },
  },
  {
    name: "Adam Reyes",
    country: "Spain",
    age: 24,
    weight: "69kg",
    stance: "Orthodox",
    record: "18–5",
    verification: { text: "Record self-reported", color: "#767676" },
  },
];

export const seasonCalendar = [
  {
    title: "Championnats de France Amateurs Seniors — Qualifications",
    date: "10–11 Jan 2026",
    location: "Paris (Stade Max Rousié)",
  },
  {
    title: "Championnats de France Amateurs Seniors — Demi-finales",
    date: "17–18 Jan 2026",
    location: "Maisnil-lès-Ruitz (Parc départemental d'Olhain)",
  },
  {
    title: "Championnats de France Amateurs Seniors — Finales",
    date: "24 Jan 2026",
    location: "La Rochelle (Salle Gaston Neveur)",
  },
  {
    title: "CFA Juniors · CNA Cadets · CNA Minimes",
    date: "14–15 Feb 2026",
    location: "Maisnil-lès-Ruitz (Parc départemental d'Olhain)",
  },
  {
    title: "Date limite — Championnats Régionaux BEA",
    date: "5 Apr 2026",
    location: "",
  },
  {
    title: "Critérium National BEA — Masculin",
    date: "22–24 May 2026",
    location: "Bourges (CREPS Centre Val de Loire)",
  },
  {
    title: "Critérium National BEA — Féminin",
    date: "29–31 May 2026",
    location: "Bourges (CREPS Centre Val de Loire)",
  },
];

export const sessionLibrary = [
  { label: "Warm-up", detail: "10 min" },
  { label: "Shadow boxing", detail: "3 × 3" },
  { label: "Pads", detail: "5 × 3" },
  { label: "Bag", detail: "4 × 3" },
  { label: "Cool-down", detail: "10 min" },
];

export const videoMarkers = [
  { type: "good" as const, position: 12, note: "Nice extension on the jab there." },
  { type: "improve" as const, position: 38, note: "You're staying directly in front after the combination." },
  { type: "mistake" as const, position: 61, note: "Dropping the left hand on the exit." },
  { type: "tactical" as const, position: 80, note: "Good use of the southpaw angle here." },
];

export const scoutingFilters = [
  "Age",
  "Country",
  "Weight",
  "Stance",
  "Experience",
  "Competition level",
  "Record",
  "Video availability",
  "Verification",
];
