import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setAppMode } from "@/lib/supabase/spar";
import type { BoxerAppApi } from "./useBoxerApp";

export function TeamTab({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  const router = useRouter();
  const supabase = createClient();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);
  const [changingClub, setChangingClub] = useState(false);

  async function switchToSpar() {
    if (!state.userId) return;
    setSwitching(true);
    await setAppMode(supabase, state.userId, "spar");
    router.push("/app/spar");
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.joinClubWithCode(code);
      setCode("");
      setChangingClub(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-5 pb-8 pt-1">
      <div className="text-xl font-semibold text-bone mb-6">MON COIN</div>
      {state.coachName && !changingClub ? (
        <div className="bg-carbon rounded-card p-5">
          <div className="flex gap-4 items-center mb-4">
            <div className="w-14 h-14 rounded-full bg-steel shrink-0" />
            <div>
              <div className="text-[17px] font-semibold text-bone">{state.coachName}</div>
              <div className="text-xs text-verified font-semibold">Coach</div>
            </div>
          </div>
          <button
            onClick={() => setChangingClub(true)}
            className="bg-transparent border-none text-smoke text-[13px] underline cursor-pointer p-0"
          >
            Changer de club
          </button>
        </div>
      ) : (
        <div className="bg-carbon rounded-card p-5">
          <div className="text-[15px] text-smoke mb-4">
            {state.coachName
              ? `Tu es dans le club de ${state.coachName}. Entre un nouveau code pour en changer.`
              : "Aucun coach lié pour l’instant. Entre le code de ton club pour le rejoindre."}
          </div>
          <form onSubmit={handleJoin} className="flex gap-2.5">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ABC123"
              autoCapitalize="characters"
              className="flex-1 h-11 rounded-md bg-[#141414] border border-steel px-4 text-[15px] text-bone placeholder:text-smoke outline-none focus:border-verified"
            />
            <button
              type="submit"
              disabled={!code.trim() || submitting}
              className="h-11 px-5 rounded-pill bg-bone text-obsidian text-sm font-semibold cursor-pointer disabled:opacity-50"
            >
              {submitting ? "…" : "Rejoindre"}
            </button>
          </form>
          {error && <div className="text-sm text-error mt-3">{error}</div>}
          {state.coachName && (
            <button
              onClick={() => {
                setChangingClub(false);
                setCode("");
                setError(null);
              }}
              className="mt-3.5 bg-transparent border-none text-smoke text-[13px] cursor-pointer p-0"
            >
              Annuler
            </button>
          )}
        </div>
      )}

      <button
        onClick={switchToSpar}
        disabled={switching}
        className="mt-8 h-11 px-5 rounded-pill border border-fight-red text-fight-red text-sm font-semibold cursor-pointer disabled:opacity-50"
      >
        {switching ? "…" : "Passer sur Spar →"}
      </button>

      <button
        onClick={api.logout}
        className="mt-3 h-11 px-5 rounded-pill border border-steel text-bone text-sm font-semibold cursor-pointer block"
      >
        Se déconnecter
      </button>
    </div>
  );
}
