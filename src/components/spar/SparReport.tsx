"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { submitSparReport } from "@/lib/supabase/spar";
import { ChevronLeftIcon } from "@/components/icons/Icon";

const REASONS = [
  "Comportement dangereux",
  "Intensité excessive",
  "Harcèlement",
  "Faux profil",
  "Poids / niveau incorrect",
  "Absence sans prévenir",
  "Lieu inapproprié",
  "Autre",
];

export function SparReport({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId || !reason) return;
    setSubmitting(true);
    try {
      await submitSparReport(supabase, { sparSessionId: id, reporterId: userId, reason, details: details || undefined });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-8 text-center">
        <div className="text-bone font-semibold text-lg mb-6">Signalement envoyé. Merci de nous avoir prévenus.</div>
        <button onClick={() => router.back()} className="h-12 px-8 rounded-pill bg-bone text-obsidian text-sm font-semibold cursor-pointer">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian max-w-md mx-auto">
      <div className="px-5 pt-16 pb-5 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone">
          <ChevronLeftIcon />
        </button>
        <div className="text-[17px] font-semibold text-bone">Signaler un problème</div>
      </div>

      <div className="px-5 pb-10">
        <div className="text-smoke text-[13px] mb-3">Motif</div>
        <div className="mb-5">
          {REASONS.map((r, i) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`w-full flex items-center justify-between py-3.5 bg-transparent border-none cursor-pointer text-left ${i < REASONS.length - 1 ? "border-b border-steel" : ""}`}
            >
              <span className="text-bone text-[15px]">{r}</span>
              {reason === r && <span className="text-fight-red">✓</span>}
            </button>
          ))}
        </div>

        <div className="text-smoke text-[13px] mb-2.5">Détails (optionnel)</div>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Décris ce qui s'est passé…"
          rows={4}
          className="w-full rounded-md bg-carbon border border-steel px-3.5 py-3.5 text-bone text-sm placeholder:text-smoke outline-none focus:border-verified resize-none mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={!reason || submitting}
          className="w-full h-[52px] rounded-pill bg-error text-pure-white text-[15px] font-semibold cursor-pointer disabled:opacity-50"
        >
          {submitting ? "…" : "Envoyer le signalement"}
        </button>
      </div>
    </div>
  );
}
