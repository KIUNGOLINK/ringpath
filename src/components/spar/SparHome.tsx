"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setAppMode, listSparSessions, listMySparSessions, listMyJoinRequests } from "@/lib/supabase/spar";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons/Icon";
import { SparMark } from "./SparLogo";
import { SparSessionCard } from "./SparSessionCard";

export function SparHome() {
  const router = useRouter();
  const supabase = createClient();
  const [switching, setSwitching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [nearby, setNearby] = useState<Awaited<ReturnType<typeof listSparSessions>>>([]);
  const [requests, setRequests] = useState<Awaited<ReturnType<typeof listMyJoinRequests>>>([]);
  const [upcoming, setUpcoming] = useState<Awaited<ReturnType<typeof listMySparSessions>>>([]);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id ?? null;
      if (cancelled) return;
      setUserId(uid);
      const [sessions, myRequests, mine] = await Promise.all([
        listSparSessions(supabase, {}),
        uid ? listMyJoinRequests(supabase, uid) : Promise.resolve([]),
        uid ? listMySparSessions(supabase, uid) : Promise.resolve([]),
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
    if (!userId) return;
    setSwitching(true);
    await setAppMode(supabase, userId, "compet");
    router.push("/app");
  }

  function requireAuth(onAuthenticated: () => void) {
    if (userId) {
      onAuthenticated();
      return;
    }
    router.push("/app?intent=spar");
  }

  return (
    <div className="min-h-screen bg-obsidian px-5 pt-16 pb-12 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-1">
          {!userId && (
            <button
              onClick={() => router.push("/")}
              className="w-8 h-8 -ml-2 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone"
            >
              <ChevronLeftIcon size={18} />
            </button>
          )}
          <SparMark size={28} />
          <div className="text-[26px] font-bold text-bone tracking-[-0.01em]">SPAR</div>
        </div>
        {userId ? (
          <button
            onClick={switchToCompet}
            disabled={switching}
            className="h-9 px-3.5 rounded-pill border border-steel text-bone text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            {switching ? "…" : "RingPath Compét →"}
          </button>
        ) : (
          <button
            onClick={() => router.push("/app?intent=spar&login=1")}
            className="h-9 px-3.5 rounded-pill border border-steel text-bone text-xs font-semibold cursor-pointer"
          >
            Se connecter
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-3">
        <button
          onClick={() => router.push("/app/spar/find")}
          className="flex-1 h-24 rounded-card bg-fight-red text-pure-white cursor-pointer flex flex-col items-center justify-center gap-1"
        >
          <span className="font-condensed text-xl font-bold tracking-[-0.01em]">TROUVER</span>
          <span className="text-[12px] font-medium opacity-90">Un sparring près de toi</span>
        </button>
        <button
          onClick={() => requireAuth(() => router.push("/app/spar/create"))}
          className="flex-1 h-24 rounded-card bg-carbon border border-steel text-bone cursor-pointer flex flex-col items-center justify-center gap-1"
        >
          <span className="font-condensed text-xl font-bold tracking-[-0.01em]">CRÉER</span>
          <span className="text-[12px] font-medium text-smoke">Organise ta session</span>
        </button>
      </div>

      <button
        onClick={() => router.push("/app/spar/timer")}
        className="w-full h-11 rounded-pill border border-steel text-bone text-[13px] font-semibold cursor-pointer mb-7"
      >
        Minuteur
      </button>

      {loading ? (
        <div className="text-smoke text-sm">Chargement…</div>
      ) : (
        <>
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold tracking-[0.05em] text-smoke">PRÈS DE TOI</div>
              {nearby.length > 0 && (
                <button
                  onClick={() => router.push("/app/spar/find")}
                  className="text-xs font-semibold text-smoke bg-transparent border-none cursor-pointer flex items-center gap-0.5"
                >
                  Tout voir <ChevronRightIcon size={14} />
                </button>
              )}
            </div>
            {nearby.length === 0 ? (
              <div className="bg-carbon rounded-card p-5">
                <div className="text-bone text-sm mb-1">Aucun sparring à proximité pour l&rsquo;instant.</div>
                <div className="text-smoke text-[13px]">Sois le premier à créer une session dans ta zone.</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {nearby.map((s) => (
                  <SparSessionCard key={s.id} session={s} onClick={() => router.push(`/app/spar/session/${s.id}`)} />
                ))}
              </div>
            )}
          </div>

          {userId ? (
            <>
              {requests.length > 0 && (
                <div className="mb-7">
                  <div className="text-xs font-semibold tracking-[0.05em] text-smoke mb-3">TES DEMANDES</div>
                  <button
                    onClick={() => router.push("/app/spar/requests")}
                    className="w-full text-left bg-carbon rounded-card p-4 flex items-center justify-between cursor-pointer border-none"
                  >
                    <span className="text-bone text-sm font-semibold">
                      {requests.length} demande{requests.length > 1 ? "s" : ""} en attente
                    </span>
                    <ChevronRightIcon size={16} className="text-smoke" />
                  </button>
                </div>
              )}

              {upcoming.length > 0 && (
                <div className="mb-7">
                  <div className="text-xs font-semibold tracking-[0.05em] text-smoke mb-3">À VENIR</div>
                  <div className="flex flex-col gap-2.5">
                    {upcoming.map((s) => (
                      <SparSessionCard key={s.id} session={s} onClick={() => router.push(`/app/spar/session/${s.id}`)} />
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => router.push("/app/spar/history")}
                className="block mx-auto text-smoke text-[13px] underline bg-transparent border-none cursor-pointer"
              >
                Voir l&rsquo;historique
              </button>
            </>
          ) : (
            <div className="bg-carbon rounded-card p-5">
              <div className="text-bone text-sm mb-1">Pas encore de compte ?</div>
              <div className="text-smoke text-[13px]">
                Connecte-toi ou crée un compte pour demander à rejoindre une session ou en créer une.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
