"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SearchIcon, StarIcon } from "@/components/icons/Icon";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { scoutingFighters, scoutingFilters } from "@/data/mock";

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function ScoutingDiscover() {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show(text: string) {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  function toggleWatch(name: string) {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        show(`Removed ${name} from watchlist`);
      } else {
        next.add(name);
        show(`Added ${name} to watchlist`);
      }
      return next;
    });
  }

  return (
    <div className="bg-passport-bg text-obsidian min-h-screen pb-24">
      <div className="h-[72px] flex items-center justify-between px-6 md:px-12 border-b border-passport-border">
        <Logo color="#070707" />
        <div className="flex-1 max-w-[420px] mx-4 md:mx-8 h-11 rounded-pill bg-white border border-passport-border flex items-center gap-2 px-4 text-smoke text-sm">
          <SearchIcon size={16} />
          Search fighters
        </div>
        <div className="w-8 h-8 rounded-full bg-passport-border shrink-0" />
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-12 px-6 md:px-12 pt-10 pb-24 max-w-[1296px] mx-auto">
        <div>
          <div className="text-xs font-semibold tracking-[0.06em] text-smoke uppercase mb-5">Filters</div>
          <div className="flex flex-col gap-5 text-sm text-obsidian">
            {scoutingFilters.map((f) => (
              <div key={f}>{f}</div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm text-smoke mb-6">142 fighters</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scoutingFighters.map((f) => (
              <div key={f.name}>
                <ImageSlot caption="portrait, 3:4" radius={12} className="w-full aspect-[3/4] mb-3" />
                <div className="text-base font-semibold text-obsidian">{f.name}</div>
                <div className="text-[13px] text-smoke mb-1">
                  {f.country} · {f.age} · {f.weight} · {f.stance}
                </div>
                <div className="text-sm font-semibold text-obsidian mb-1">{f.record}</div>
                <div className="text-xs mb-3" style={{ color: f.verification.color }}>
                  {f.verification.text === "Coach confirmed" ? "✓ " : ""}
                  {f.verification.text}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/passport/${slugify(f.name)}`}
                    className="flex-1 h-9 rounded-pill bg-obsidian text-bone text-xs font-semibold flex items-center justify-center"
                  >
                    VIEW PASSPORT
                  </Link>
                  <button
                    onClick={() => toggleWatch(f.name)}
                    aria-label={watchlist.has(f.name) ? "Remove from watchlist" : "Add to watchlist"}
                    className="w-9 h-9 rounded-full border border-passport-border flex items-center justify-center text-obsidian cursor-pointer bg-white"
                  >
                    <StarIcon size={16} filled={watchlist.has(f.name)} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="fixed left-1/2 -translate-x-1/2 bottom-24 bg-obsidian text-bone text-sm font-semibold px-5 py-3 rounded-md z-[300]"
          style={{ boxShadow: "0 8px 30px rgba(0,0,0,.3)" }}
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
