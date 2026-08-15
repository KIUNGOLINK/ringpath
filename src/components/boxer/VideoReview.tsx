import { ImageSlot } from "@/components/ui/ImageSlot";
import { ChevronLeftIcon, PlayIcon } from "@/components/icons/Icon";
import { videoMarkers } from "@/data/mock";
import type { BoxerAppApi } from "./useBoxerApp";

const MARKER_COLOR: Record<string, string> = {
  good: "#30D158",
  improve: "#FFB020",
  mistake: "#E5484D",
  tactical: "#7DD3FC",
};

export function VideoReview({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  const active = videoMarkers[state.activeMarker];

  return (
    <div className="absolute inset-0 bg-black overflow-y-auto">
      <div className="relative w-full aspect-video bg-carbon">
        <ImageSlot caption="sparring footage, coach annotation view" className="absolute inset-0 w-full h-full" />
        <button
          onClick={api.closeVideoReview}
          className="absolute top-14 left-3 w-9 h-9 bg-transparent border-none text-bone cursor-pointer flex items-center justify-center"
        >
          <ChevronLeftIcon />
        </button>
        <button
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[52px] h-[52px] rounded-full flex items-center justify-center border-none cursor-pointer text-bone"
          style={{ background: "rgba(255,255,255,.15)" }}
        >
          <PlayIcon size={22} />
        </button>
      </div>

      <div className="px-5 py-4">
        <div className="relative h-1.5 rounded-full bg-steel mb-6">
          {videoMarkers.map((m, i) => (
            <button
              key={m.position}
              onClick={() => api.setActiveMarker(i)}
              className="absolute -top-[5px] w-4 h-4 rounded-full cursor-pointer border-2 border-black"
              style={{ left: `${m.position}%`, background: MARKER_COLOR[m.type] }}
              aria-label={m.type}
            />
          ))}
        </div>

        <div className="flex items-center gap-2.5 mb-3">
          <span
            className="text-[11px] font-semibold tracking-[0.04em] px-2.5 py-[3px] rounded-pill text-obsidian uppercase"
            style={{ background: MARKER_COLOR[active.type] }}
          >
            {active.type}
          </span>
        </div>

        <div className="flex gap-2.5 mb-5">
          <div className="w-6 h-6 rounded-full bg-steel shrink-0" />
          <div>
            <div className="text-[13px] font-semibold text-bone">Coach Sofia</div>
            <div className="text-sm text-mist">{active.note}</div>
          </div>
        </div>

        <div className="flex gap-5">
          <span className="text-[13px] font-semibold text-bone cursor-pointer">Reply</span>
          <span className="text-[13px] font-semibold text-bone cursor-pointer">Mark reviewed</span>
        </div>
      </div>
    </div>
  );
}
