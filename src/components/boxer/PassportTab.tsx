import { useRef, useState } from "react";
import { ConfirmedBadge } from "@/components/ui/StatusPill";
import type { BoxerAppApi } from "./useBoxerApp";

const STANCE_LABELS: Record<string, string> = {
  ORTHODOX: "ORTHODOXE",
  SOUTHPAW: "GAUCHER",
};

export function PassportTab({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  const displayFirstName = (state.firstName || "").toUpperCase();
  const displayLastName = (state.lastName || "").toUpperCase();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await api.uploadPhoto(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-passport-bg min-h-full px-5 pt-6 pb-12">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-full aspect-[3/4] mb-2 rounded-[16px] overflow-hidden cursor-pointer border-none p-0 bg-[#E9E6DF] flex items-center justify-center"
      >
        {state.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={state.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[13px] text-[#8A8578]">Ajouter une photo</span>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-bone text-sm">
            Envoi…
          </div>
        )}
        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-obsidian text-bone flex items-center justify-center text-lg">
          {state.photoUrl ? "✎" : "+"}
        </div>
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {error && <div className="text-xs text-error mb-3">{error}</div>}
      <div className="text-4xl leading-[38px] font-bold text-obsidian mb-3 mt-4">
        {displayFirstName}
        <br />
        {displayLastName}
      </div>
      <div className="flex gap-2.5 flex-wrap text-[13px] text-smoke mb-6">
        <span>{state.weight} KG</span>
        <span>·</span>
        <span>{STANCE_LABELS[state.stance] ?? state.stance}</span>
      </div>
      <div className="font-condensed text-7xl leading-[64px] font-bold text-obsidian">
        {state.wins}–{state.losses}
      </div>
      <div className="text-xs tracking-[0.06em] text-smoke uppercase mb-4">Palmarès amateur</div>
      {state.coachName ? (
        <ConfirmedBadge label="CONFIRMÉ PAR LE COACH" />
      ) : (
        <div className="text-xs text-smoke">Pas encore confirmé par un coach</div>
      )}
    </div>
  );
}
