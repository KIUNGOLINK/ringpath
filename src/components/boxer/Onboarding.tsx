import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import type { BoxerAppApi } from "./useBoxerApp";

export function Onboarding({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  if (state.onboardStep === 0) return <OnboardStep0 api={api} />;
  if (state.onboardStep === 1) return <OnboardStep1 api={api} />;
  if (state.onboardStep === 2) return <OnboardStep2 api={api} />;
  return <OnboardStep3 api={api} />;
}

function OnboardStep0({ api }: { api: BoxerAppApi }) {
  const router = useRouter();
  return (
    <div className="absolute inset-0 bg-passport-bg flex flex-col">
      <div className="flex-1 m-5 mt-5 rounded-lg overflow-hidden bg-obsidian flex flex-col items-center justify-center gap-4">
        <LogoMark size={120} color="#F5F3EE" />
        <span className="text-2xl font-semibold tracking-[-0.02em] text-bone">RINGPATH</span>
      </div>
      <div className="px-6 pt-8 pb-10">
        <div className="text-4xl font-bold text-obsidian leading-[40px] mb-5">CONSTRUIS TON CHEMIN.</div>
        <div className="text-[11px] text-obsidian/55 mb-1.5 px-0.5">Suis ta progression, ton club, tes compétitions.</div>
        <button
          onClick={() => {
            api.setSparIntent(false);
            api.goToStep(1);
          }}
          className="w-full h-[52px] rounded-pill bg-obsidian text-bone text-[15px] font-semibold cursor-pointer mb-3.5"
        >
          RingPath Compét
        </button>
        <div className="text-[11px] text-obsidian/55 mb-1.5 px-0.5">Trouve un partenaire de sparring près de toi.</div>
        <button
          onClick={() => router.push("/app/spar")}
          className="w-full h-[52px] rounded-pill bg-fight-red text-pure-white text-[15px] font-semibold cursor-pointer mb-3"
        >
          Spar
        </button>
        <button
          onClick={api.goToLogin}
          className="w-full h-11 bg-transparent text-obsidian text-sm font-semibold cursor-pointer"
        >
          J&rsquo;ai déjà un compte
        </button>
      </div>
    </div>
  );
}

function OnboardStep1({ api }: { api: BoxerAppApi }) {
  return (
    <div className="absolute inset-0 bg-obsidian px-5 pt-16 pb-6">
      <div className="h-0.5 bg-steel rounded-full mb-8">
        <div className="w-1/5 h-full bg-bone rounded-full" />
      </div>
      <div className="text-xs text-smoke mb-2">ÉTAPE 1/3</div>
      <div className="text-[28px] font-bold text-bone mb-8">QUI ES-TU ?</div>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => api.goToStep(2)}
          className="h-[88px] rounded-card bg-carbon border border-steel text-bone text-[17px] font-semibold text-left px-5 cursor-pointer"
        >
          BOXEUR / BOXEUSE
        </button>
        <a
          href="/coach/signup"
          className="h-[88px] rounded-card bg-carbon border border-steel text-bone text-[17px] font-semibold text-left px-5 flex items-center"
        >
          COACH
        </a>
        <button
          disabled
          className="h-[88px] rounded-card bg-carbon border border-steel text-smoke text-[17px] font-semibold text-left px-5 cursor-not-allowed"
        >
          RECRUTEUR <span className="text-[11px] text-[#474747]">· bientôt disponible</span>
        </button>
      </div>
    </div>
  );
}

function OnboardStep2({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  const isSpar = state.sparIntent;
  return (
    <div className="absolute inset-0 bg-obsidian px-5 pt-16 pb-6 overflow-y-auto">
      <div className="h-0.5 bg-steel rounded-full mb-8">
        <div className={`${isSpar ? "w-1/2" : "w-2/3"} h-full bg-bone rounded-full`} />
      </div>
      <div className="text-xs text-smoke mb-2">{isSpar ? "ÉTAPE 1/2" : "ÉTAPE 2/3"}</div>
      <div className="text-[28px] font-bold text-bone mb-1">TES INFOS</div>
      {isSpar && (
        <div className="text-[13px] text-smoke mb-8">
          Ton poids et ta garde servent à te proposer les bons partenaires.
        </div>
      )}
      {!isSpar && <div className="mb-8" />}
      <div className="flex flex-col gap-4 mb-8">
        <Field label="Prénom" value={state.firstName} onChange={api.setFirstName} placeholder="Nadia" />
        <Field label="Nom" value={state.lastName} onChange={api.setLastName} placeholder="Kader" />
        <Field label="Catégorie de poids (kg)" value={state.weight} onChange={api.setWeight} placeholder="71" />
        <div>
          <div className="text-[13px] font-medium text-mist mb-2">Garde</div>
          <div className="flex gap-3">
            {(["ORTHODOX", "SOUTHPAW"] as const).map((s) => (
              <button
                key={s}
                onClick={() => api.setStance(s)}
                className={`flex-1 h-11 rounded-pill text-[13px] font-semibold cursor-pointer transition-colors ${
                  state.stance === s
                    ? "bg-bone text-obsidian border-none"
                    : "bg-transparent text-bone border border-[#474747]"
                }`}
              >
                {s === "ORTHODOX" ? "ORTHODOXE" : "GAUCHER"}
              </button>
            ))}
          </div>
        </div>
        {!isSpar && (
          <Field
            label="Code club (optionnel)"
            value={state.clubCode}
            onChange={api.setClubCode}
            placeholder="ABC123"
          />
        )}
        <Field label="Email" value={state.email} onChange={api.setEmail} placeholder="toi@email.com" type="email" />
        <Field
          label="Mot de passe"
          value={state.password}
          onChange={api.setPassword}
          placeholder="6 caractères minimum"
          type="password"
        />
      </div>
      <button
        onClick={() => api.goToStep(3)}
        disabled={!state.firstName || !state.email || state.password.length < 6}
        className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
      >
        Continuer
      </button>
    </div>
  );
}

function OnboardStep3({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  return (
    <div className="absolute inset-0 bg-obsidian flex flex-col items-center justify-center px-6 text-center">
      <div className="text-[28px] font-bold text-bone tracking-[-0.01em] mb-8">
        TON CHEMIN COMMENCE ICI.
      </div>
      {state.authError && (
        <div className="text-sm text-error mb-4">{state.authError}</div>
      )}
      <button
        onClick={api.enterApp}
        disabled={state.authSubmitting}
        className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer disabled:opacity-50"
      >
        {state.authSubmitting ? "Création du compte…" : "Entrer dans RingPath"}
      </button>
    </div>
  );
}

export function Login({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  return (
    <div className="absolute inset-0 bg-obsidian px-5 pt-16 pb-6 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <LogoMark size={24} />
        <span className="text-[15px] font-semibold text-bone">RINGPATH</span>
      </div>
      <div className="text-[28px] font-bold text-bone mb-8">CONTENT DE TE REVOIR</div>
      <div className="flex flex-col gap-4 mb-6">
        <Field label="Email" value={state.email} onChange={api.setEmail} placeholder="toi@email.com" type="email" />
        <Field label="Mot de passe" value={state.password} onChange={api.setPassword} placeholder="••••••••" type="password" />
      </div>
      {state.authError && <div className="text-sm text-error mb-4">{state.authError}</div>}
      <button
        onClick={api.login}
        disabled={state.authSubmitting}
        className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer disabled:opacity-50 mb-3"
      >
        {state.authSubmitting ? "Connexion…" : "Se connecter"}
      </button>
      <button
        onClick={api.goToOnboarding}
        className="w-full h-11 bg-transparent text-bone text-sm font-semibold cursor-pointer"
      >
        Créer un compte à la place
      </button>
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
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <div className="text-[13px] font-medium text-mist mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[52px] rounded-md bg-[#141414] border border-steel px-4 text-[16px] text-bone placeholder:text-smoke outline-none focus:border-verified"
      />
    </div>
  );
}
