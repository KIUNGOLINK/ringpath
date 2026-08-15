"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { listJoinRequestsForHost, acceptJoinRequest, declineJoinRequest } from "@/lib/supabase/spar";
import { ChevronLeftIcon } from "@/components/icons/Icon";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function SparRequests() {
  const router = useRouter();
  const supabase = createClient();
  const [requests, setRequests] = useState<Awaited<ReturnType<typeof listJoinRequestsForHost>>>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    const requestsData = await listJoinRequestsForHost(supabase, userId);
    setRequests(requestsData);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  async function handleAccept(requestId: string, sparSessionId: string, requesterId: string) {
    setActingId(requestId);
    try {
      await acceptJoinRequest(supabase, requestId, sparSessionId, requesterId);
      await load();
    } finally {
      setActingId(null);
    }
  }

  async function handleDecline(requestId: string) {
    setActingId(requestId);
    try {
      await declineJoinRequest(supabase, requestId);
      await load();
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian max-w-md mx-auto">
      <div className="px-5 pt-16 pb-5 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone">
          <ChevronLeftIcon />
        </button>
        <div className="text-[17px] font-semibold text-bone">Demandes reçues</div>
      </div>

      <div className="px-5 pb-10 flex flex-col gap-3">
        {loading ? (
          <div className="text-smoke text-sm">Chargement…</div>
        ) : requests.length === 0 ? (
          <div className="text-smoke text-sm">Aucune demande en attente.</div>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="bg-carbon rounded-card p-4.5">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-10 h-10 rounded-full bg-steel shrink-0" />
                <div className="flex-1">
                  <div className="text-bone font-semibold text-[15px]">{r.requesterName}</div>
                  <div className="text-smoke text-xs">
                    {r.requesterBoxer?.weight_kg ? `${r.requesterBoxer.weight_kg} KG · ` : ""}
                    {r.requesterBoxer?.stance === "ORTHODOX" ? "Orthodoxe" : r.requesterBoxer?.stance === "SOUTHPAW" ? "Gaucher" : ""}
                  </div>
                </div>
                {r.session && <div className="text-smoke text-[11px]">{formatDate(r.session.session_date)}</div>}
              </div>
              {r.message && <div className="text-mist text-[13px] italic mb-3">&laquo; {r.message} &raquo;</div>}
              <div className="flex gap-2.5">
                <button
                  onClick={() => handleAccept(r.id, r.spar_session_id, r.requester_id)}
                  disabled={actingId === r.id}
                  className="flex-1 h-11 rounded-pill bg-bone text-obsidian text-sm font-semibold cursor-pointer disabled:opacity-50"
                >
                  {actingId === r.id ? "…" : "Accepter"}
                </button>
                <button
                  onClick={() => handleDecline(r.id)}
                  disabled={actingId === r.id}
                  className="flex-1 h-11 rounded-pill border border-steel text-bone text-sm font-semibold cursor-pointer disabled:opacity-50"
                >
                  Décliner
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
