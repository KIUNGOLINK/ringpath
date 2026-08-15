import type { BoxerAppApi } from "./useBoxerApp";

export function TeamTab({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  return (
    <div className="px-5 pb-8 pt-1">
      <div className="text-xl font-semibold text-bone mb-6">MON COIN</div>
      {state.coachName ? (
        <div className="bg-carbon rounded-card p-5 flex gap-4 items-center">
          <div className="w-14 h-14 rounded-full bg-steel shrink-0" />
          <div>
            <div className="text-[17px] font-semibold text-bone">{state.coachName}</div>
            <div className="text-xs text-verified font-semibold">Coach</div>
          </div>
        </div>
      ) : (
        <div className="bg-carbon rounded-card p-5 text-[15px] text-smoke">
          Aucun coach lié pour l&rsquo;instant. Demande le code de ton club et ajoute-le depuis les réglages.
        </div>
      )}

      <button
        onClick={api.logout}
        className="mt-8 h-11 px-5 rounded-pill border border-steel text-bone text-sm font-semibold cursor-pointer"
      >
        Se déconnecter
      </button>
    </div>
  );
}
