"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setAppMode, listSparSessions, listMySparSessions, listMyJoinRequests } from "@/lib/supabase/spar";

const MODE_LABELS: Record<string, string> = { OPEN_ROUNDS: "OPEN ROUNDS", CAMP_SPAR: "CAMP SPAR" };

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
}

export function SparHome() {
  const router = useRouter();
  const supabase = createClient();
  const [switching, setSwitching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nearby, setNearby] = useState<Awaited<ReturnType<typeof listSparSessions>>>([]);
  const [requests, setRequests] = useState<Awaited<ReturnType<typeof listMyJoinRequests>>>([]);
  const [upcoming, setUpcoming] = useState<Awaited<ReturnType<typeof listMySparSessions>>>([]);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) return;
      const [sessions, myRequests, mine] = await Promise.all([
        listSparSessions(supabase, {}),
        listMyJoinRequests(supabase, userId),
        listMySparSessions(supabase, userId),
      ]);
      if (cancelled) return;
      setNearby(sessions.slice(0, 5));
      setRequests(myRequests.filter((r) => r.status === "PENDING"));
      setUpcoming(mine.filter((s) => s.status === "CONFIRMED" || s.status === "OPEN" || s.status === "FULL"));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function switchToCompet() {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return;
    setSwitching(true);
    await setAppMode(supabase, data.session.user.id, "compet");
    router.push("/app");
  }

  return (
    <div className="min-h-screen bg-obsidian px-5 pt-16 pb-12 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-[26px] font-bold text-bone tracking-[-0.01em]">SPAR</div>
        <button
          onClick={switchToCompet}
          disabled={switching}
          className="h-9 px-3.5 rounded-pill border border-steel text-bone text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          {switching ? "…" : "RingPath Compét →"}
        </button>
      </div>

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => router.push("/app/spar/find")}
          className="flex-1 h-[88px] rounded-card bg-fight-red text-pure-white text-[13px] font-semibold cursor-pointer flex flex-col items-center justify-center gap-1.5"
        >
          <span>Trouver un sparring</span>
        </button>
        <button
          onClick={() => router.push("/app/spar/create")}
          className="flex-1 h-[88px] rounded-card bg-carbon border border-steel text-bone text-[13px] font-semibold cursor-pointer flex flex-col items-center justify-center gap-1.5"
        >
          <span>Créer un sparring</span>
        </button>
      </div>

      {loading ? (
        <div className="text-smoke text-sm">Chargement…</div>
      ) : (
        <>
          <Section title="PRÈS DE TOI">
            {nearby.length === 0 ? (
              <>
                <div className="text-bone text-sm mb-1">Aucun sparring à proximité pour l&rsquo;instant.</div>
                <div className="text-smoke text-[13px]">Sois le premier à créer une session dans ta zone.</div>
              </>
            ) : (
              <div className="flex flex-col gap-2.5 -m-5">
                {nearby.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => router.push(`/app/spar/session/${s.id}`)}
                    className="text-left p-4 bg-transparent border-none border-b border-steel last:border-b-0 cursor-pointer"
                  >
                    <div className="text-[11px] font-semibold tracking-[0.05em] text-smoke mb-1">{MODE_LABELS[s.mode]}</div>
                    <div className="text-bone font-semibold text-sm mb-1">
                      {formatDate(s.session_date)} · {s.start_time.slice(0, 5)}
                    </div>
                    <div className="text-smoke text-[13px]">
                      {s.city}
                      {s.min_weight_kg && s.max_weight_kg ? ` · ${s.min_weight_kg}–${s.max_weight_kg} KG` : ""}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Section>

          <Section title="TES DEMANDES">
            {requests.length === 0 ? (
              <div className="text-smoke text-sm">Aucune demande en attente.</div>
            ) : (
              <div className="text-bone text-sm">{requests.length} en attente</div>
            )}
          </Section>

          <Section title="À VENIR">
            {upcoming.length === 0 ? (
              <div className="text-smoke text-sm">Rien de programmé.</div>
            ) : (
              upcoming.map((s) => (
                <button
                  key={s.id}
                  onClick={() => router.push(`/app/spar/session/${s.id}`)}
                  className="block w-full text-left bg-transparent border-none cursor-pointer text-bone text-sm mb-1"
                >
                  {formatDate(s.session_date)} · {s.start_time.slice(0, 5)} — {s.city}
                </button>
              ))
            )}
          </Section>

          <button
            onClick={() => router.push("/app/spar/history")}
            className="block mx-auto text-smoke text-[13px] underline bg-transparent border-none cursor-pointer"
          >
            Voir l&rsquo;historique
          </button>
        </>
      )}
    </div>
  );
}

function Section({ title, children, last = false }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={last ? "" : "mb-7"}>
      <div className="text-xs font-semibold tracking-[0.05em] text-smoke mb-3">{title}</div>
      <div className="bg-carbon rounded-card p-5">{children}</div>
    </div>
  );
}
