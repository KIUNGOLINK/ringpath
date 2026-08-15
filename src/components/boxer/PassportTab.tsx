import { ImageSlot } from "@/components/ui/ImageSlot";
import { ConfirmedBadge } from "@/components/ui/StatusPill";
import type { BoxerAppApi } from "./useBoxerApp";

export function PassportTab({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  const displayFirstName = (state.firstName || "YANIS").toUpperCase();

  return (
    <div className="bg-passport-bg min-h-full px-5 pt-6 pb-12">
      <ImageSlot
        caption="portrait, 3:4, gym background"
        radius={16}
        className="w-full aspect-[3/4] mb-5"
      />
      <div className="text-4xl leading-[38px] font-bold text-obsidian mb-3">
        {displayFirstName}
        <br />
        KADER
      </div>
      <div className="flex gap-2.5 flex-wrap text-[13px] text-smoke mb-6">
        <span>23</span>
        <span>·</span>
        <span>{state.weight} KG</span>
        <span>·</span>
        <span>{state.stance}</span>
        <span>·</span>
        <span>PARIS, FRANCE</span>
      </div>
      <div className="font-condensed text-7xl leading-[64px] font-bold text-obsidian">16–3</div>
      <div className="text-xs tracking-[0.06em] text-smoke uppercase mb-4">Amateur Record</div>
      <ConfirmedBadge />
    </div>
  );
}
