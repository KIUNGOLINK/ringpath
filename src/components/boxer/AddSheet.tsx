import { useState } from "react";
import { ChevronRightIcon } from "@/components/icons/Icon";
import { createClient } from "@/lib/supabase/client";
import { updateBoxerWeight, recordFightResult, logTrainingSession } from "@/lib/supabase/queries";
import type { SessionType } from "@/lib/supabase/types";
import type { BoxerAppApi } from "./useBoxerApp";

const ITEMS = [
  { key: "training", label: "Entraînement", enabled: true },
  { key: "sparring", label: "Sparring", enabled: true },
  { key: "video", label: "Vidéo", enabled: false },
  { key: "result", label: "Résultat de combat", enabled: true },
  { key: "weight", label: "Poids", enabled: true },
];

const SESSION_TYPES: { key: SessionType; label: string }[] = [
  { key: "Technical", label: "Technique" },
  { key: "Pads", label: "Pao" },
  { key: "Conditioning", label: "Préparation physique" },
  { key: "Roadwork", label: "Endurance" },
  { key: "Recovery", label: "Récupération" },
];

type Step = "menu" | "weight" | "result" | "training";

export function AddSheet({ api }: { api: BoxerAppApi }) {
  const supabase = createClient();
  const [step, setStep] = useState<Step>("menu");
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  function reset() {
    setStep("menu");
    setWeight("");
    setDone(null);
  }

  function handleClose() {
    reset();
    api.closeAddSheet();
  }

  async function saveWeight() {
    if (!api.state.userId || !weight) return;
    setSaving(true);
    try {
      await updateBoxerWeight(supabase, api.state.userId, Number(weight));
      await api.reloadBundle();
      setDone("Poids mis à jour.");
    } finally {
      setSaving(false);
    }
  }

  async function saveResult(result: "win" | "loss") {
    if (!api.state.userId) return;
    setSaving(true);
    try {
      await recordFightResult(supabase, api.state.userId, result);
      await api.reloadBundle();
      setDone(result === "win" ? "Victoire ajoutée à ton palmarès." : "Défaite ajoutée à ton palmarès.");
    } finally {
      setSaving(false);
    }
  }

  async function saveTraining(type: SessionType) {
    if (!api.state.camp) return;
    setSaving(true);
    try {
      await logTrainingSession(supabase, api.state.camp.id, type);
      await api.reloadBundle();
      setDone("Séance ajoutée à ton parcours.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      onClick={handleClose}
      className="absolute inset-0 z-[100] flex items-end"
      style={{ background: "rgba(0,0,0,.6)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-carbon rounded-t-[24px] px-5 pt-3 pb-8"
      >
        <div className="w-9 h-1 bg-steel rounded-full mx-auto mb-5" />

        {done ? (
          <div className="py-3 flex flex-col items-center">
            <div className="text-bone text-[15px] mb-5 text-center">{done}</div>
            <button
              onClick={handleClose}
              className="h-11 px-6 rounded-pill bg-bone text-obsidian text-sm font-semibold cursor-pointer"
            >
              Fermer
            </button>
          </div>
        ) : step === "menu" ? (
          <>
            <div className="text-[13px] font-semibold tracking-[0.05em] text-smoke mb-3">
              AJOUTER À TON PARCOURS
            </div>
            {ITEMS.map((item, i) => (
              <div
                key={item.key}
                onClick={() => {
                  if (!item.enabled) return;
                  if (item.key === "sparring") api.openSparringFromSheet();
                  else if (item.key === "weight") setStep("weight");
                  else if (item.key === "result") setStep("result");
                  else if (item.key === "training") setStep("training");
                }}
                className={`h-14 flex items-center justify-between text-bone text-base ${
                  item.enabled ? "cursor-pointer" : "opacity-40 cursor-default"
                } ${i < ITEMS.length - 1 ? "border-b border-steel" : ""}`}
              >
                {item.label}
                {item.enabled ? (
                  <ChevronRightIcon size={18} className="text-smoke" />
                ) : (
                  <span className="text-smoke text-[11px]">Bientôt disponible</span>
                )}
              </div>
            ))}
          </>
        ) : step === "weight" ? (
          <>
            <div className="text-bone text-[17px] font-semibold mb-4">Nouveau poids</div>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="71"
              className="w-full h-[52px] rounded-md bg-[#141414] border border-steel px-4 text-[16px] text-bone placeholder:text-smoke outline-none focus:border-verified mb-5"
            />
            <button
              onClick={saveWeight}
              disabled={!weight || saving}
              className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer disabled:opacity-50"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </>
        ) : step === "training" ? (
          <>
            <div className="text-bone text-[17px] font-semibold mb-4">Quel type de séance ?</div>
            {SESSION_TYPES.map((t, i) => (
              <button
                key={t.key}
                onClick={() => saveTraining(t.key)}
                disabled={saving}
                className={`w-full h-[52px] flex items-center text-left text-bone text-[15px] bg-transparent border-none cursor-pointer disabled:opacity-50 ${
                  i < SESSION_TYPES.length - 1 ? "border-b border-steel" : ""
                }`}
              >
                {t.label}
              </button>
            ))}
          </>
        ) : (
          <>
            <div className="text-bone text-[17px] font-semibold mb-4">Résultat de combat</div>
            <div className="flex gap-3">
              <button
                onClick={() => saveResult("win")}
                disabled={saving}
                className="flex-1 h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer disabled:opacity-50"
              >
                Victoire
              </button>
              <button
                onClick={() => saveResult("loss")}
                disabled={saving}
                className="flex-1 h-[52px] rounded-pill border border-steel text-bone text-[15px] font-semibold cursor-pointer disabled:opacity-50"
              >
                Défaite
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
