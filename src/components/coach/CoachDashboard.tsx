"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCoachInfo, getCoachRoster } from "@/lib/supabase/queries";
import { BellIcon, ChevronLeftIcon } from "@/components/icons/Icon";

type CoachTab = "dashboard" | "roster" | "builder";
type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

const DAYS: Day[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_LABELS: Record<Day, string> = {
  MON: "LUN",
  TUE: "MAR",
  WED: "MER",
  THU: "JEU",
  FRI: "VEN",
  SAT: "SAM",
  SUN: "DIM",
};
const SESSION_TYPES = ["Technique", "Pao", "Sparring", "Préparation physique", "Endurance", "Récupération"];
const TAB_LABELS: Record<CoachTab, string> = {
  dashboard: "Tableau de bord",
  roster: "Effectif",
  builder: "Planificateur",
};

type RosterEntry = Awaited<ReturnType<typeof getCoachRoster>>[number];

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function CoachDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [coachName, setCoachName] = useState("");
  const [clubName, setClubName] = useState("");
  const [clubCode, setClubCode] = useState("");
  const [roster, setRoster] = useState<RosterEntry[]>([]);

  const [tab, setTab] = useState<CoachTab>("dashboard");
  const [fighterId, setFighterId] = useState<string | null>(null);
  const [day, setDay] = useState<Day>("MON");
  const [campPlan, setCampPlan] = useState<Partial<Record<Day, string>>>({});

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) {
        router.replace("/coach/login");
        return;
      }
      const [{ profile, coach }, rosterData] = await Promise.all([
        getCoachInfo(supabase, userId),
        getCoachRoster(supabase, userId),
      ]);
      if (cancelled) return;
      setCoachName(profile ? `${profile.first_name} ${profile.last_name}`.trim() : "");
      setClubName(coach?.club_name ?? "");
      setClubCode(coach?.club_code ?? "");
      setRoster(rosterData);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, router]);

  if (loading) {
    return <div className="px-6 md:px-[72px] py-16 text-smoke">Chargement…</div>;
  }

  const fighter = roster.find((f) => f.profileId === fighterId);
  const activeCamps = roster.filter((f) => f.camp);

  return (
    <div className="px-6 md:px-[72px] py-16 pb-32 max-w-[1296px] mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="text-xs text-smoke mb-2">BONSOIR,</div>
          <div className="text-4xl font-bold text-bone mb-2">{coachName.toUpperCase() || "COACH"}</div>
          <div className="text-[15px] text-smoke">
            {clubName} · {roster.length} boxeurs/boxeuses · code {clubCode}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-graphite flex items-center justify-center text-bone">
            <BellIcon />
          </div>
          <div className="w-11 h-11 rounded-full bg-steel" />
        </div>
      </div>

      <div className="flex gap-6 border-b border-steel mb-10">
        {(["dashboard", "roster", "builder"] as CoachTab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setFighterId(null);
            }}
            className={`pb-3 text-sm font-semibold cursor-pointer border-b-2 -mb-px bg-transparent border-x-0 border-t-0 ${
              tab === t ? "text-bone border-bone" : "text-smoke border-transparent hover:text-mist"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <>
          <Section title="Code du club">
            <div className="bg-carbon rounded-card p-6 flex items-center justify-between">
              <div className="text-sm text-smoke">Partage-le avec tes boxeurs et boxeuses pour rejoindre {clubName || "ton club"}.</div>
              <div className="font-condensed text-3xl font-bold text-bone tracking-[0.1em]">{clubCode}</div>
            </div>
          </Section>

          <Section title="Camps actifs" last={activeCamps.length === 0}>
            {activeCamps.length === 0 ? (
              <div className="text-smoke text-sm">Aucun camp actif pour l&rsquo;instant.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {activeCamps.map((f) => {
                  const days = daysUntil(f.camp!.fightDate);
                  const pct = Math.min(100, Math.round((f.camp!.weekCurrent / f.camp!.weekTotal) * 100));
                  return (
                    <div key={f.profileId} className="bg-carbon rounded-card p-6">
                      <div className="text-lg font-semibold text-bone mb-1">{f.name}</div>
                      <div className="text-sm text-smoke mb-4">
                        {f.weightKg ? `${f.weightKg} KG · ` : ""}
                        {days !== null ? `Combat dans ${days} jours` : "Aucune date de combat"}
                      </div>
                      <div className="text-[13px] text-mist mb-2">
                        Semaine {f.camp!.weekCurrent} / {f.camp!.weekTotal}
                      </div>
                      <div className="h-1 rounded-full bg-graphite">
                        <div className="h-full rounded-full bg-bone" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {roster.length === 0 && (
            <div className="text-smoke text-sm">
              Aucun boxeur pour l&rsquo;instant — donne-leur ton code de club (
              <span className="text-bone font-semibold">{clubCode}</span>) pour rejoindre.
            </div>
          )}
        </>
      )}

      {tab === "roster" &&
        (fighter ? (
          <div>
            <button
              onClick={() => setFighterId(null)}
              className="flex items-center gap-1 text-bone text-sm mb-4 cursor-pointer bg-transparent border-none"
            >
              <ChevronLeftIcon size={16} /> Retour à l&rsquo;effectif
            </button>
            <div className="text-2xl font-bold text-bone mb-1">{fighter.name}</div>
            <div className="text-sm text-smoke mb-6">
              {fighter.weightKg ? `${fighter.weightKg} KG · ` : ""}
              {fighter.stance ?? "Garde non renseignée"}
            </div>
            <div className="flex gap-5 border-b border-steel pb-3 mb-6">
              <span className="text-[13px] font-semibold text-bone">Aperçu</span>
              <span className="text-[13px] text-[#474747]">Calendrier</span>
              <span className="text-[13px] text-[#474747]">Vidéo</span>
              <span className="text-[13px] text-[#474747]">Parcours</span>
            </div>
            {fighter.camp ? (
              <div className="text-smoke text-sm">
                Camp vs {fighter.camp.opponentName} — semaine {fighter.camp.weekCurrent}/{fighter.camp.weekTotal}
              </div>
            ) : (
              <div className="text-smoke text-sm">Aucun camp actif.</div>
            )}
          </div>
        ) : roster.length === 0 ? (
          <div className="text-smoke text-sm">
            Aucun boxeur pour l&rsquo;instant — donne-leur ton code de club (
            <span className="text-bone font-semibold">{clubCode}</span>) pour rejoindre.
          </div>
        ) : (
          <div className="border-t border-steel">
            <div className="grid grid-cols-[40px_1.5fr_1fr_1fr] gap-4 py-3.5 text-xs text-smoke border-b border-steel">
              <span />
              <span>Nom</span>
              <span>Poids</span>
              <span>Garde</span>
            </div>
            {roster.map((f) => (
              <button
                key={f.profileId}
                onClick={() => setFighterId(f.profileId)}
                className="grid grid-cols-[40px_1.5fr_1fr_1fr] gap-4 py-4 text-sm text-bone border-b border-steel items-center w-full text-left cursor-pointer bg-transparent border-x-0 border-t-0 hover:bg-carbon transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-steel" />
                <span>{f.name}</span>
                <span>{f.weightKg ? `${f.weightKg} KG` : "—"}</span>
                <span>{f.stance ?? "—"}</span>
              </button>
            ))}
          </div>
        ))}

      {tab === "builder" && (
        <div>
          <div className="text-[13px] font-semibold tracking-[0.05em] text-smoke mb-1">
            PLANIFICATEUR DE SEMAINE — clique un jour, puis un type de séance
          </div>
          <div className="text-xs text-[#474747] mb-4">
            Aperçu de planification — l&rsquo;assignation réelle des séances d&rsquo;un boxeur arrive bientôt.
          </div>
          <div className="flex gap-2 mb-8 max-w-xl">
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`flex-1 text-center py-3 rounded-md text-xs font-semibold cursor-pointer border transition-colors ${
                  day === d ? "bg-bone text-obsidian border-bone" : "bg-carbon text-bone border-steel hover:border-mist"
                }`}
              >
                {DAY_LABELS[d]}
                {campPlan[d] && (
                  <div className={`text-[9px] mt-1 ${day === d ? "text-obsidian/60" : "text-smoke"}`}>
                    {campPlan[d]}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="text-sm text-smoke mb-3">Bibliothèque de séances</div>
          <div className="flex flex-wrap gap-2.5 mb-8">
            {SESSION_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setCampPlan((prev) => ({ ...prev, [day]: t }))}
                className={`px-4 py-2.5 rounded-pill text-[13px] font-semibold cursor-pointer border border-steel transition-colors ${
                  campPlan[day] === t ? "bg-bone text-obsidian" : "bg-graphite text-bone hover:bg-steel"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="text-xs text-[#474747]">
            Chaque jour peut aussi être assigné au clavier (tab + entrée) — pas besoin de glisser-déposer.
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children, last = false }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={last ? "" : "mb-16"}>
      <div className="text-[13px] font-semibold tracking-[0.06em] text-smoke uppercase mb-5">{title}</div>
      {children}
    </div>
  );
}
