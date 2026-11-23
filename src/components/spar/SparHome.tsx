"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { listSparSessions, listMySparSessions, listMyJoinRequests } from "@/lib/supabase/spar";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons/Icon";
import { SparMark } from "./SparLogo";
import { SparSessionCard } from "./SparSessionCard";

export function SparHome() {
  const router = useRouter();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
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
      if (uid) {
        supabase
          .from("profiles")
          .select("first_name")
          .eq("id", uid)
          .maybeSingle()
          .then(({ data: profile }) => {
            if (!cancelled && profile?.first_name) setFirstName(profile.first_name);
          });
      }
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

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  function requireAuth(onAuthenticated: () => void) {
    if (userId) {
      onAuthenticated();
      return;
    }
    router.push("/app?intent=spar");
  }

  return (
    <div className="min-h-screen bg-obsidian px-5 pt-16 pb-12 max-w-md lg:max-w-2xl mx-auto">
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
          <span className="flex items-center gap-1 lg:hidden">
            <SparMark size={28} />
            <span className="text-[26px] font-bold text-bone tracking-[-0.01em]">SPAR</span>
          </span>
          <span className="hidden font-condensed text-3xl font-bold uppercase text-bone lg:inline">Accueil</span>
        </div>
        {userId ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Mon compte"
              aria-expanded={menuOpen}
              className="w-10 h-10 rounded-pill border border-steel bg-carbon text-bone font-condensed text-lg font-bold cursor-pointer flex items-center justify-center"
            >
              {(firstName[0] ?? "S").toUpperCase()}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 z-20 min-w-[180px] rounded-card bg-carbon border border-steel p-1.5 shadow-light-lg">
                {firstName && <div className="px-3 pt-2 pb-1.5 text-xs text-smoke">Connecté en tant que {firstName}</div>}
                <button
                  onClick={signOut}
                  className="w-full text-left px-3 py-2.5 rounded-md bg-transparent border-none text-bone text-sm font-medium cursor-pointer hover:bg-graphite"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
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
