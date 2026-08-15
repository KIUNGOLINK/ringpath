import type { Tab } from "./types";
import type { BoxerAppApi } from "./useBoxerApp";
import { PlusIcon } from "@/components/icons/Icon";

function HomeGlyph({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 11l8-7 8 7M6 10v9h5v-5h2v5h5v-9" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CampGlyph({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 3v18M6 4h11l-3 4 3 4H6" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TeamGlyph({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="10" r="4" stroke={color} strokeWidth="1.75" />
      <circle cx="16" cy="11" r="3.2" stroke={color} strokeWidth="1.75" />
    </svg>
  );
}
function PassportGlyph({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke={color} strokeWidth="1.75" />
      <circle cx="9" cy="10" r="1.6" stroke={color} strokeWidth="1.5" />
      <path d="M13 9h4M13 12h4M6 16h12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BottomNav({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  const color = (tab: Tab) => (state.activeTab === tab ? "#F5F3EE" : "#6F6F6F");

  return (
    <div
      className="absolute left-0 right-0 bottom-0 h-16 flex items-center justify-around z-40"
      style={{ background: "rgba(7,7,7,.94)", backdropFilter: "blur(20px)", borderTop: "1px solid #202020" }}
    >
      <button
        onClick={() => api.setActiveTab("home")}
        aria-label="Accueil"
        className="w-11 h-11 flex items-center justify-center cursor-pointer bg-transparent border-none"
      >
        <HomeGlyph color={color("home")} />
      </button>
      <button
        onClick={() => api.setActiveTab("camp")}
        aria-label="Camp"
        className="w-11 h-11 flex items-center justify-center cursor-pointer bg-transparent border-none"
      >
        <CampGlyph color={color("camp")} />
      </button>
      <button
        onClick={api.openAddSheet}
        className="w-12 h-12 rounded-full bg-bone border-none cursor-pointer flex items-center justify-center text-obsidian -translate-y-1"
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,.4)" }}
        aria-label="Ajouter à ton parcours"
      >
        <PlusIcon size={20} />
      </button>
      <button
        onClick={() => api.setActiveTab("team")}
        aria-label="Mon coin"
        className="w-11 h-11 flex items-center justify-center cursor-pointer bg-transparent border-none"
      >
        <TeamGlyph color={color("team")} />
      </button>
      <button
        onClick={() => api.setActiveTab("passport")}
        aria-label="Passeport"
        className="w-11 h-11 flex items-center justify-center cursor-pointer bg-transparent border-none"
      >
        <PassportGlyph color={color("passport")} />
      </button>
    </div>
  );
}
