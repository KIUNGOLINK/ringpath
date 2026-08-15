"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createSparSession } from "@/lib/supabase/spar";
import { getBoxerBundle } from "@/lib/supabase/queries";
import { ChevronLeftIcon } from "@/components/icons/Icon";
import type { SparMode, SparIntensity } from "@/lib/supabase/types";

const LEVELS = ["Débutant", "Intermédiaire", "Avancé", "Compétiteur amateur", "Amateur élite"];
const INTENSITIES: { key: SparIntensity; label: string; description: string }[] = [
  { key: "TECHNICAL", label: "TECHNIQUE", description: "Travail contrôlé" },
  { key: "MODERATE", label: "MODÉRÉ", description: "Sparring classique" },
  { key: "COMPETITION_PREP", label: "PRÉPA COMPÉT", description: "Préparation compétiteur" },
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      {label && <div className="text-[13px] font-medium text-mist mb-2">{label}</div>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[52px] rounded-md bg-[#141414] border border-steel px-4 text-[15px] text-bone placeholder:text-smoke outline-none focus:border-verified"
      />
    </div>
  );
}

function ChipRow({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3.5 py-2 rounded-pill text-[13px] font-semibold cursor-pointer border ${
            value === opt ? "bg-bone text-obsidian border-bone" : "bg-graphite text-bone border-steel"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function CreateSpar() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<SparMode>("OPEN_ROUNDS");
  const [sessionDate, setSessionDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [city, setCity] = useState("");
  const [venueName, setVenueName] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [stance, setStance] = useState<"ANY" | "ORTHODOX" | "SOUTHPAW">("ANY");
  const [level, setLevel] = useState("");
  const [intensity, setIntensity] = useState<SparIntensity>("MODERATE");
  const [targetRounds, setTargetRounds] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("2");
  const [description, setDescription] = useState("");
  const [campId, setCampId] = useState<string | undefined>(undefined);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) return;
      const bundle = await getBoxerBundle(supabase, userId);
      if (bundle.boxer?.weight_kg) {
        setMinWeight(String(bundle.boxer.weight_kg - 3));
        setMaxWeight(String(bundle.boxer.weight_kg + 3));
      }
      if (bundle.camp) setCampId(bundle.camp.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate() {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId || !sessionDate || !startTime || !city) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await createSparSession(supabase, {
        hostId: userId,
        mode,
        sessionDate,
        startTime,
        city,
        venueName: venueName || undefined,
        minWeightKg: minWeight ? Number(minWeight) : undefined,
        maxWeightKg: maxWeight ? Number(maxWeight) : undefined,
        requestedStance: stance,
        level: level || undefined,
        intensity,
        targetRounds: targetRounds ? Number(targetRounds) : undefined,
        maxParticipants: Number(maxParticipants) || 2,
        description: description || undefined,
        campId: mode === "CAMP_SPAR" ? campId : undefined,
      });
      router.push(`/app/spar/session/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian px-5 pt-16 pb-16 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-7">
        <button onClick={() => router.back()} className="w-11 h-11 -ml-2.5 flex items-center justify-center cursor-pointer bg-transparent border-none text-bone">
          <ChevronLeftIcon />
        </button>
        <div className="text-[17px] font-semibold text-bone">Créer un sparring</div>
      </div>

      <div className="text-[13px] font-medium text-mist mb-2">QUE CHERCHES-TU ?</div>
      <div className="flex gap-2.5 mb-6">
        <button
          onClick={() => setMode("OPEN_ROUNDS")}
          className={`flex-1 rounded-card p-4 text-left border cursor-pointer ${mode === "OPEN_ROUNDS" ? "bg-carbon border-bone" : "bg-transparent border-steel"}`}
        >
          <div className="text-bone font-semibold text-sm mb-1">OPEN ROUNDS</div>
          <div className="text-smoke text-xs">Envie de boxer, sparring détente</div>
        </button>
        <button
          onClick={() => setMode("CAMP_SPAR")}
          className={`flex-1 rounded-card p-4 text-left border cursor-pointer ${mode === "CAMP_SPAR" ? "bg-carbon border-bone" : "bg-transparent border-steel"}`}
        >
          <div className="text-bone font-semibold text-sm mb-1">CAMP SPAR</div>
          <div className="text-smoke text-xs">Préparation, critères précis</div>
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <Field label="Date" value={sessionDate} onChange={setSessionDate} placeholder="2026-08-23" type="date" />
          </div>
          <div className="flex-1">
            <Field label="Heure" value={startTime} onChange={setStartTime} placeholder="17:30" type="time" />
          </div>
        </div>
        <Field label="Ville / zone" value={city} onChange={setCity} placeholder="Paris" />
        <Field label="Salle (optionnel)" value={venueName} onChange={setVenueName} placeholder="Fight Room Belleville" />
      </div>

      <div className="text-[13px] font-medium text-mist mb-2">POIDS</div>
      <div className="flex gap-3 mb-6">
        <Field label="" value={minWeight} onChange={setMinWeight} placeholder="65" type="number" />
        <Field label="" value={maxWeight} onChange={setMaxWeight} placeholder="72" type="number" />
      </div>

      <div className="text-[13px] font-medium text-mist mb-2">GARDE</div>
      <div className="mb-6">
        <ChipRow options={["ANY", "ORTHODOX", "SOUTHPAW"]} value={stance} onChange={(v) => setStance(v as typeof stance)} />
      </div>

      {mode === "CAMP_SPAR" && (
        <>
          <div className="text-[13px] font-medium text-mist mb-2">NIVEAU RECHERCHÉ</div>
          <div className="mb-6">
            <ChipRow options={LEVELS} value={level} onChange={setLevel} />
          </div>
        </>
      )}

      <div className="text-[13px] font-medium text-mist mb-2">INTENSITÉ</div>
      <div className="flex flex-col gap-2 mb-6">
        {INTENSITIES.map((i) => (
          <button
            key={i.key}
            onClick={() => setIntensity(i.key)}
            className={`flex items-center justify-between p-3.5 rounded-card border cursor-pointer ${intensity === i.key ? "bg-carbon border-bone" : "bg-transparent border-steel"}`}
          >
            <div className="text-left">
              <div className="text-bone font-semibold text-[13px]">{i.label}</div>
              <div className="text-smoke text-xs mt-0.5">{i.description}</div>
            </div>
            {intensity === i.key && <span className="text-bone">✓</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <Field label="Rounds (optionnel)" value={targetRounds} onChange={setTargetRounds} placeholder="6" type="number" />
        <Field label="Participants max" value={maxParticipants} onChange={setMaxParticipants} placeholder="2" type="number" />
      </div>

      <div className="mb-8">
        <div className="text-[13px] font-medium text-mist mb-2">Sur quoi tu travailles ? (optionnel)</div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Déplacement, jab, sorties d'angle…"
          maxLength={500}
          rows={3}
          className="w-full rounded-md bg-[#141414] border border-steel px-4 py-3 text-[15px] text-bone placeholder:text-smoke outline-none focus:border-verified resize-none"
        />
      </div>

      {error && <div className="text-sm text-error mb-4">{error}</div>}

      <button
        onClick={handleCreate}
        disabled={submitting || !sessionDate || !startTime || !city}
        className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer disabled:opacity-50"
      >
        {submitting ? "Publication…" : "Publier le sparring"}
      </button>
    </div>
  );
}
