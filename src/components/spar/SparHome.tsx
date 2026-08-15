"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setAppMode } from "@/lib/supabase/spar";

export function SparHome() {
  const router = useRouter();
  const supabase = createClient();
  const [switching, setSwitching] = useState(false);

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
        <button className="flex-1 h-[88px] rounded-card bg-fight-red text-pure-white text-[13px] font-semibold cursor-pointer flex flex-col items-center justify-center gap-1.5">
          <span>Trouver un sparring</span>
        </button>
        <button className="flex-1 h-[88px] rounded-card bg-carbon border border-steel text-bone text-[13px] font-semibold cursor-pointer flex flex-col items-center justify-center gap-1.5">
          <span>Créer un sparring</span>
        </button>
      </div>

      <Section title="PRÈS DE TOI">
        <div className="text-bone text-sm mb-1">Aucun sparring à proximité pour l&rsquo;instant.</div>
        <div className="text-smoke text-[13px]">Sois le premier à créer une session dans ta zone.</div>
      </Section>

      <Section title="TES DEMANDES">
        <div className="text-smoke text-sm">Aucune demande en attente.</div>
      </Section>

      <Section title="À VENIR" last>
        <div className="text-smoke text-sm">Rien de programmé.</div>
      </Section>
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
