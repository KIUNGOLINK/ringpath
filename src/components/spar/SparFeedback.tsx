"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSparSession, getFeedbackGivenForSession, submitSparFeedback } from "@/lib/supabase/spar";
import { ChevronLeftIcon } from "@/components/icons/Icon";

const TAGS = [
  { key: "respectful", label: "Respectueux" },
  { key: "controlledIntensity", label: "Intensité maîtrisée" },
  { key: "onTime", label: "Ponctuel" },
  { key: "matchedDescription", label: "Correspond à la description" },
  { key: "safePartner", label: "Partenaire safe" },
  { key: "goodCommunication", label: "Bonne communication" },
] as const;

type TagKey = (typeof TAGS)[number]["key"];

export function SparFeedback({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<Awaited<ReturnType<typeof getSparSession>> | null>(null);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<{ userId: string; name: string } | null>(null);
  const [wouldAgain, setWouldAgain] = useState<boolean | null>(null);
  const [tags, setTags] = useState<Record<TagKey, boolean>>({} as Record<TagKey, boolean>);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id ?? null;
    setUserId(uid);
    if (!uid) return;
    const [result, reviewedIds] = await Promise.all([
      getSparSession(supabase, id),
      getFeedbackGivenForSession(supabase, id, uid),
    ]);
    setData(result);
    setReviewed(reviewedIds);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  if (loading || !data) {
    return <div className="min-h-screen bg-obsidian flex items-center justify-center text-smoke">Chargement…</div>;
  }

  const pending = data.participants.filter((p) => p.user_id !== userId && !reviewed.includes(p.user_id));

  function openTarget(uid: string, name: string) {
    setTarget({ userId: uid, name });
    setWouldAgain(null);
    setTags({} as Record<TagKey, boolean>);
    setComment("");
  }

  async function handleSubmit() {
    if (!userId || !target || wouldAgain === null) return;
    setSubmitting(true);
    try {
      await submitSparFeedback(supabase, {
        sparSessionId: id,
        authorId: userId,
        targetId: target.userId,
        wouldSparAgain: wouldAgain,
        respectful: tags.respectful,
        controlledIntensity: tags.controlledIntensity,
        onTime: tags.onTime,
        matchedDescription: tags.matchedDescription,
        safePartner: tags.safePartner,
        goodCommunication: tags.goodCommunication,
        privateComment: comment || undefined,
      });
      setTarget(null);
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian max-w-md mx-auto">
      <div className="px-5 pt-16 pb-5 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone">
          <ChevronLeftIcon />
        </button>
        <div className="text-[17px] font-semibold text-bone">Comment ça s&rsquo;est passé ?</div>
      </div>

      <div className="px-5 pb-10 flex flex-col gap-2.5">
        {pending.length === 0 ? (
          <div className="text-smoke text-sm">Tu as donné ton avis sur tous les participants. Merci !</div>
        ) : (
          pending.map((p) => (
            <button
              key={p.id}
              onClick={() => openTarget(p.user_id, p.name)}
              className="flex items-center gap-3 bg-carbon rounded-card p-4 cursor-pointer text-left border-none"
            >
              <div className="w-10 h-10 rounded-full bg-steel shrink-0" />
              <span className="text-bone font-semibold text-[15px] flex-1">{p.name}</span>
              <span className="text-smoke">›</span>
            </button>
          ))
        )}
      </div>

      {target && (
        <div onClick={() => setTarget(null)} className="fixed inset-0 z-[100] flex items-end" style={{ background: "rgba(0,0,0,.65)" }}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md mx-auto bg-carbon rounded-t-[24px] px-5 pt-4 pb-10">
            <div className="w-9 h-1 bg-steel rounded-full mx-auto mb-5" />
            <div className="text-bone font-semibold text-[17px] mb-5">{target.name}</div>

            <div className="text-smoke text-[13px] mb-2.5">Referais-tu du sparring avec cette personne ?</div>
            <div className="flex gap-2.5 mb-5">
              <button
                onClick={() => setWouldAgain(true)}
                className={`flex-1 h-[46px] rounded-pill font-semibold text-sm cursor-pointer border-none ${wouldAgain === true ? "bg-success text-obsidian" : "bg-graphite text-bone"}`}
              >
                Oui
              </button>
              <button
                onClick={() => setWouldAgain(false)}
                className={`flex-1 h-[46px] rounded-pill font-semibold text-sm cursor-pointer border-none ${wouldAgain === false ? "bg-error text-obsidian" : "bg-graphite text-bone"}`}
              >
                Non
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {TAGS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTags((s) => ({ ...s, [t.key]: !s[t.key] }))}
                  className={`px-3 py-2 rounded-pill text-xs font-semibold cursor-pointer border ${tags[t.key] ? "bg-bone text-obsidian border-bone" : "bg-graphite text-bone border-steel"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Note privée (optionnel, visible par toi seul)"
              rows={2}
              className="w-full rounded-md bg-graphite border border-steel px-3.5 py-3 text-bone text-sm placeholder:text-smoke outline-none focus:border-verified resize-none mb-5"
            />

            <button
              onClick={handleSubmit}
              disabled={wouldAgain === null || submitting}
              className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer disabled:opacity-50"
            >
              {submitting ? "…" : "Envoyer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
