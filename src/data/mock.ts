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

// The 2025-2026 season (which these dates covered) has ended. FFBoxe had not
// published the 2026-2027 national calendar as of Aug 2026 — check
// ffboxe.com/actualites/calendrier-des-competitions-nationales/ and refill
// this list once it's out, rather than showing stale dates as current.
export const seasonCalendarSeason = "2026–2027";
export const seasonCalendar: { title: string; date: string; location: string }[] = [];

export const sessionLibrary = [
  { label: "Échauffement", detail: "10 min" },
  { label: "Shadow boxing", detail: "3 × 3" },
  { label: "Pao", detail: "5 × 3" },
  { label: "Sac", detail: "4 × 3" },
  { label: "Retour au calme", detail: "10 min" },
];

export const videoMarkers = [
  { type: "good" as const, position: 12, note: "Belle extension sur le jab." },
  { type: "improve" as const, position: 38, note: "Tu restes trop droit après la combinaison." },
  { type: "mistake" as const, position: 61, note: "La main gauche redescend trop bas à la sortie." },
  { type: "tactical" as const, position: 80, note: "Bonne utilisation de l'angle gaucher ici." },
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
