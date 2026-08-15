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
const OPEN_ROUNDS_DEFAULT_CAPACITY = 5;
const CITIES = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes"];
const VENUE_SUGGESTIONS: Record<string, string[]> = {
  Paris: ["Fight Room"],
};

function CitySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [customMode, setCustomMode] = useState(value !== "" && !CITIES.includes(value));
  return (
    <div>
      <div className="text-[13px] font-medium text-mist mb-2">Ville / zone</div>
      <select
        value={customMode ? "__custom__" : value}
        onChange={(e) => {
          if (e.target.value === "__custom__") {
            setCustomMode(true);
            onChange("");
          } else {
            setCustomMode(false);
            onChange(e.target.value);
          }
        }}
        className="w-full h-[52px] rounded-md bg-[#141414] border border-steel px-4 text-[15px] text-bone outline-none focus:border-verified appearance-none"
      >
        <option value="" disabled>
          Choisir une ville
        </option>
        {CITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value="__custom__">Autre ville…</option>
      </select>
      {customMode && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ta ville"
          className="w-full h-[46px] rounded-md bg-[#141414] border border-steel px-4 text-[15px] text-bone placeholder:text-smoke outline-none focus:border-verified mt-2.5"
        />
      )}
    </div>
  );
}

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
  const [maxParticipants, setMaxParticipants] = useState("4");
  const [description, setDescription] = useState("");
  const [campId, setCampId] = useState<string | undefined>(undefined);
  const [splitCost, setSplitCost] = useState(false);
  const [venuePrice, setVenuePrice] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCampSpar = mode === "CAMP_SPAR";

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

  const effectiveMaxParticipants = isCampSpar ? Number(maxParticipants) || 4 : OPEN_ROUNDS_DEFAULT_CAPACITY;

  async function handleCreate() {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) {
      const wantsLogin = window.confirm(
        "Il te faut un compte pour publier un sparring. OK pour te connecter, Annuler pour créer un compte Spar."
      );
      router.push(wantsLogin ? "/app?intent=spar&login=1" : "/app?intent=spar");
      return;
    }
    if (!sessionDate || !startTime || !city) return;
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
        minWeightKg: isCampSpar && minWeight ? Number(minWeight) : undefined,
        maxWeightKg: isCampSpar && maxWeight ? Number(maxWeight) : undefined,
        requestedStance: isCampSpar ? stance : undefined,
        level: isCampSpar ? level || undefined : undefined,
        intensity: isCampSpar ? intensity : "MODERATE",
        targetRounds: isCampSpar && targetRounds ? Number(targetRounds) : undefined,
        maxParticipants: effectiveMaxParticipants,
        description: isCampSpar ? description || undefined : undefined,
        campId: isCampSpar ? campId : undefined,
        venuePriceEur: splitCost && venuePrice ? Number(venuePrice) : undefined,
        paymentLinkUrl: splitCost && paymentLink ? paymentLink : undefined,
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
        <CitySelect value={city} onChange={setCity} />
        <div>
          <Field label="Salle (optionnel)" value={venueName} onChange={setVenueName} placeholder="Fight Room Belleville" />
          {(VENUE_SUGGESTIONS[city] ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {VENUE_SUGGESTIONS[city].map((v) => (
                <button
                  key={v}
                  onClick={() => setVenueName(v)}
                  className="px-3 py-1.5 rounded-pill bg-graphite border border-steel text-bone text-xs cursor-pointer"
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isCampSpar && (
        <>
          <div className="text-[13px] font-medium text-mist mb-2">POIDS</div>
          <div className="flex gap-3 mb-6">
            <Field label="" value={minWeight} onChange={setMinWeight} placeholder="65" type="number" />
            <Field label="" value={maxWeight} onChange={setMaxWeight} placeholder="72" type="number" />
          </div>

          <div className="text-[13px] font-medium text-mist mb-2">GARDE</div>
          <div className="mb-6">
            <ChipRow options={["ANY", "ORTHODOX", "SOUTHPAW"]} value={stance} onChange={(v) => setStance(v as typeof stance)} />
          </div>

          <div className="text-[13px] font-medium text-mist mb-2">NIVEAU RECHERCHÉ</div>
          <div className="mb-6">
            <ChipRow options={LEVELS} value={level} onChange={setLevel} />
          </div>

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
            <Field label="Participants max" value={maxParticipants} onChange={setMaxParticipants} placeholder="4" type="number" />
          </div>

          <div className="mb-6">
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
        </>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 mr-3">
          <div className="text-bone font-semibold text-sm mb-0.5">Partager le prix de la salle</div>
          <div className="text-smoke text-xs">Chacun paie sa part via ton lien de paiement</div>
        </div>
        <button
          onClick={() => setSplitCost((v) => !v)}
          className={`w-12 h-7 rounded-pill relative cursor-pointer border-none shrink-0 ${splitCost ? "bg-fight-red" : "bg-steel"}`}
        >
          <span
            className="absolute top-0.5 w-6 h-6 rounded-full bg-bone transition-all"
            style={{ left: splitCost ? 22 : 2 }}
          />
        </button>
      </div>

      {splitCost && (
        <div className="flex flex-col gap-4 mb-6">
          <Field label="Prix total de la salle (€)" value={venuePrice} onChange={setVenuePrice} placeholder="58" type="number" />
          <Field label="Ton lien de paiement (Lydia, PayPal.me…)" value={paymentLink} onChange={setPaymentLink} placeholder="https://paypal.me/toncompte" />
          {venuePrice && Number(venuePrice) > 0 && (
            <div className="text-smoke text-xs">
              Part par personne ({effectiveMaxParticipants} places) : {(Number(venuePrice) / effectiveMaxParticipants).toFixed(2)} €
            </div>
          )}
        </div>
      )}

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
