"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { listSparSessions } from "@/lib/supabase/spar";
import { ChevronLeftIcon, SearchIcon } from "@/components/icons/Icon";
import { SparSessionCard } from "./SparSessionCard";
import type { SparMode } from "@/lib/supabase/types";

const MODE_FILTERS: { key: SparMode | "ALL"; label: string }[] = [
  { key: "ALL", label: "Tous" },
  { key: "OPEN_ROUNDS", label: "Open Rounds" },
  { key: "CAMP_SPAR", label: "Camp Spar" },
];

export function FindSpar() {
  const router = useRouter();
  const supabase = createClient();
  const [city, setCity] = useState("");
  const [mode, setMode] = useState<SparMode | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Awaited<ReturnType<typeof listSparSessions>>>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(async () => {
      setLoading(true);
      const data = await listSparSessions(supabase, { city: city || undefined, mode });
      if (!cancelled) {
        setResults(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, mode]);

  return (
    <div className="min-h-screen bg-obsidian max-w-md mx-auto">
      <div className="px-5 pt-16 pb-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone">
          <ChevronLeftIcon />
        </button>
        <div className="text-[17px] font-semibold text-bone">Trouver un sparring</div>
      </div>

      <div className="px-5 mb-3 relative">
        <SearchIcon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-smoke pointer-events-none" />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Filtrer par ville…"
          className="w-full h-[46px] rounded-pill bg-carbon border border-steel pl-11 pr-4 text-[15px] text-bone placeholder:text-smoke outline-none focus:border-verified"
        />
      </div>

      <div className="px-5 flex gap-2 mb-6 overflow-x-auto">
        {MODE_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setMode(f.key)}
            className={`shrink-0 px-3.5 py-2 rounded-pill text-xs font-semibold cursor-pointer border ${
              mode === f.key ? "bg-bone text-obsidian border-bone" : "bg-graphite text-bone border-steel"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-5 pb-10 flex flex-col gap-2.5">
        {loading ? (
          <div className="text-smoke text-sm">Chargement…</div>
        ) : results.length === 0 ? (
          <div className="bg-carbon rounded-card p-5 text-center">
            <div className="text-bone text-sm mb-1.5">Aucun sparring à proximité.</div>
            <div className="text-smoke text-[13px]">Sois le premier à en créer un dans ta zone.</div>
          </div>
        ) : (
          results.map((s) => (
            <SparSessionCard key={s.id} session={s} onClick={() => router.push(`/app/spar/session/${s.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}
