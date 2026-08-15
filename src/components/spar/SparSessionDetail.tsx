"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSparSession, getMyRequestForSession, requestToJoin, cancelSparSession } from "@/lib/supabase/spar";
import { ChevronLeftIcon } from "@/components/icons/Icon";

const MODE_LABELS: Record<string, string> = { OPEN_ROUNDS: "OPEN ROUNDS", CAMP_SPAR: "CAMP SPAR" };
const INTENSITY_LABELS: Record<string, string> = { TECHNICAL: "Technique", MODERATE: "Modéré", COMPETITION_PREP: "Préparation compétiteur" };

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

export function SparSessionDetail({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<Awaited<ReturnType<typeof getSparSession>> | null>(null);
  const [myRequest, setMyRequest] = useState<Awaited<ReturnType<typeof getMyRequestForSession>>>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id ?? null;
    setUserId(uid);
    const result = await getSparSession(supabase, id);
    setData(result);
    if (uid) {
      const req = await getMyRequestForSession(supabase, id, uid);
      setMyRequest(req);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  if (loading || !data) {
    return <div className="min-h-screen bg-obsidian flex items-center justify-center text-smoke">Chargement…</div>;
  }

  const { session: s, hostName, hostBoxer, participants } = data;
  const isHost = s.host_id === userId;
  const isParticipant = participants.some((p) => p.user_id === userId);
  const spotsLeft = s.max_participants - participants.length;

  async function handleRequest() {
    if (!userId) return;
    setSubmitting(true);
    setError(null);
    try {
      await requestToJoin(supabase, id, userId, message || undefined);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancelSession() {
    setSubmitting(true);
    try {
      await cancelSparSession(supabase, id);
      router.push("/app/spar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian px-5 pt-16 pb-16 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone">
          <ChevronLeftIcon />
        </button>
        <div className="text-smoke text-xs font-semibold tracking-[0.05em]">{MODE_LABELS[s.mode]}</div>
      </div>

      <div className="font-condensed text-[40px] font-bold text-bone mb-1">{formatDate(s.session_date)}</div>
      <div className="text-bone font-semibold text-xl mb-5">{s.start_time.slice(0, 5)}</div>

      <div className="bg-carbon rounded-card p-4.5 mb-5">
        <Row label="Lieu" value={s.venue_name ? `${s.venue_name}, ${s.city}` : s.city} />
        {s.min_weight_kg && s.max_weight_kg && <Row label="Poids" value={`${s.min_weight_kg}–${s.max_weight_kg} KG`} />}
        {s.requested_stance && s.requested_stance !== "ANY" && (
          <Row label="Garde" value={s.requested_stance === "ORTHODOX" ? "Orthodoxe" : "Gaucher"} />
        )}
        {s.level && <Row label="Niveau" value={s.level} />}
        <Row label="Intensité" value={INTENSITY_LABELS[s.intensity]} />
        {s.target_rounds && <Row label="Rounds" value={String(s.target_rounds)} />}
        <Row label="Places" value={`${participants.length} / ${s.max_participants}`} isLast />
      </div>

      {s.description && (
        <div className="mb-5">
          <div className="text-smoke text-xs font-semibold tracking-[0.05em] mb-2">SUR QUOI IL TRAVAILLE</div>
          <div className="text-bone text-sm leading-5">{s.description}</div>
        </div>
      )}

      <div className="mb-5">
        <div className="text-smoke text-xs font-semibold tracking-[0.05em] mb-2.5">ORGANISATEUR</div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-steel shrink-0" />
          <div>
            <div className="text-bone font-semibold text-[15px]">{hostName}</div>
            {hostBoxer && (
              <div className="text-smoke text-xs">
                {hostBoxer.weight_kg ? `${hostBoxer.weight_kg} KG` : ""}
                {hostBoxer.wins || hostBoxer.losses ? ` · ${hostBoxer.wins}–${hostBoxer.losses}` : ""}
              </div>
            )}
          </div>
        </div>
      </div>

      {participants.length > 0 && (
        <div className="mb-7">
          <div className="text-smoke text-xs font-semibold tracking-[0.05em] mb-2.5">PARTICIPANTS CONFIRMÉS</div>
          {participants.map((p) => (
            <div key={p.id} className="text-bone text-sm mb-1">
              {p.name} {p.role === "HOST" ? "(organisateur)" : ""}
            </div>
          ))}
        </div>
      )}

      {error && <div className="text-sm text-error mb-4">{error}</div>}

      {isHost ? (
        <>
          <button
            onClick={() => router.push("/app/spar/requests")}
            className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer mb-3"
          >
            Voir les demandes
          </button>
          {s.status !== "CANCELLED" && s.status !== "COMPLETED" && (
            <button
              onClick={handleCancelSession}
              disabled={submitting}
              className="w-full h-[52px] rounded-pill border border-error text-error text-[15px] font-semibold cursor-pointer"
            >
              Annuler la session
            </button>
          )}
        </>
      ) : isParticipant ? (
        <div className="w-full h-[52px] rounded-pill bg-success flex items-center justify-center text-obsidian font-semibold text-[15px]">
          Tu es inscrit
        </div>
      ) : myRequest?.status === "PENDING" ? (
        <div className="w-full h-[52px] rounded-pill border border-steel flex items-center justify-center text-smoke font-semibold text-[15px]">
          Demande envoyée
        </div>
      ) : myRequest?.status === "DECLINED" ? (
        <div className="w-full h-[52px] rounded-pill border border-steel flex items-center justify-center text-smoke font-semibold text-[15px]">
          Demande déclinée
        </div>
      ) : s.status === "FULL" ? (
        <div className="w-full h-[52px] rounded-pill border border-steel flex items-center justify-center text-smoke font-semibold text-[15px]">
          Session complète
        </div>
      ) : (
        <>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Un mot pour l'organisateur (optionnel)"
            rows={2}
            className="w-full rounded-md bg-carbon border border-steel px-3.5 py-3 text-bone text-sm placeholder:text-smoke outline-none focus:border-verified resize-none mb-3"
          />
          <button
            onClick={handleRequest}
            disabled={submitting}
            className="w-full h-[52px] rounded-pill bg-fight-red text-pure-white text-[15px] font-bold cursor-pointer disabled:opacity-60"
          >
            {submitting ? "…" : "Demander à rejoindre"}
          </button>
        </>
      )}

      {spotsLeft > 0 && (
        <div className="text-[11px] text-[#474747] text-center mt-3">
          {spotsLeft} place{spotsLeft > 1 ? "s" : ""} restante{spotsLeft > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <div className={`flex justify-between py-2.5 ${isLast ? "" : "border-b border-steel"}`}>
      <span className="text-smoke text-[13px]">{label}</span>
      <span className="text-bone text-[13px] font-semibold">{value}</span>
    </div>
  );
}
