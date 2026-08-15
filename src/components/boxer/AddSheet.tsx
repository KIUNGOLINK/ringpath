import type { BoxerAppApi } from "./useBoxerApp";
import { ChevronRightIcon } from "@/components/icons/Icon";

const ITEMS = [
  { key: "training", label: "Entraînement" },
  { key: "sparring", label: "Sparring" },
  { key: "video", label: "Vidéo" },
  { key: "result", label: "Résultat de combat" },
  { key: "weight", label: "Poids" },
];

export function AddSheet({ api }: { api: BoxerAppApi }) {
  return (
    <div
      onClick={api.closeAddSheet}
      className="absolute inset-0 z-[100] flex items-end"
      style={{ background: "rgba(0,0,0,.6)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-carbon rounded-t-[24px] px-5 pt-3 pb-8"
      >
        <div className="w-9 h-1 bg-steel rounded-full mx-auto mb-5" />
        <div className="text-[13px] font-semibold tracking-[0.05em] text-smoke mb-3">
          AJOUTER À TON PARCOURS
        </div>
        {ITEMS.map((item, i) => (
          <div
            key={item.key}
            onClick={item.key === "sparring" ? api.openSparringFromSheet : api.closeAddSheet}
            className={`h-14 flex items-center justify-between text-bone text-base cursor-pointer ${
              i < ITEMS.length - 1 ? "border-b border-steel" : ""
            }`}
          >
            {item.label}
            <ChevronRightIcon size={18} className="text-smoke" />
          </div>
        ))}
      </div>
    </div>
  );
}
