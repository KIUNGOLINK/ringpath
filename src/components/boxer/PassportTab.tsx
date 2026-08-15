import { ImageSlot } from "@/components/ui/ImageSlot";
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

  return (
    <div className="bg-passport-bg min-h-full px-5 pt-6 pb-12">
      <ImageSlot
        caption="portrait, 3:4, fond de salle"
        radius={16}
        className="w-full aspect-[3/4] mb-5"
      />
      <div className="text-4xl leading-[38px] font-bold text-obsidian mb-3">
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
