"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { listSparHistory } from "@/lib/supabase/spar";
import { ChevronLeftIcon } from "@/components/icons/Icon";

const MODE_LABELS: Record<string, string> = { OPEN_ROUNDS: "OPEN ROUNDS", CAMP_SPAR: "CAMP SPAR" };

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function SparHistory() {
  const router = useRouter();
  const supabase = createClient();
  const [history, setHistory] = useState<Awaited<ReturnType<typeof listSparHistory>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) return;
      const result = await listSparHistory(supabase, userId);
      if (!cancelled) {
        setHistory(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-obsidian max-w-md mx-auto">
      <div className="px-5 pt-16 pb-5 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone">
          <ChevronLeftIcon />
        </button>
        <div className="text-[17px] font-semibold text-bone">Historique</div>
      </div>

      <div className="px-5 pb-10 flex flex-col gap-2.5">
        {loading ? (
          <div className="text-smoke text-sm">Chargement…</div>
        ) : history.length === 0 ? (
          <div className="text-smoke text-sm">Tes sparrings passés apparaîtront ici.</div>
        ) : (
          history.map((s) => (
            <button
              key={s.id}
              onClick={() => router.push(`/app/spar/session/${s.id}`)}
              className="text-left bg-carbon rounded-card p-4 cursor-pointer border-none"
            >
              <div className="text-smoke text-[11px] font-semibold tracking-[0.05em] mb-1">{MODE_LABELS[s.mode]}</div>
              <div className="text-bone font-semibold text-[15px] mb-0.5">{formatDate(s.session_date)}</div>
              <div className="text-smoke text-[13px]">{s.city}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
