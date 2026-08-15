import { LogoMark } from "@/components/Logo";
import { ImageSlot } from "@/components/ui/ImageSlot";
import type { BoxerAppApi } from "./useBoxerApp";

export function Onboarding({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  if (state.onboardStep === 0) return <OnboardStep0 api={api} />;
  if (state.onboardStep === 1) return <OnboardStep1 api={api} />;
  if (state.onboardStep === 2) return <OnboardStep2 api={api} />;
  return <OnboardStep3 api={api} />;
}

function OnboardStep0({ api }: { api: BoxerAppApi }) {
  return (
    <div className="absolute inset-0 bg-passport-bg flex flex-col">
      <div className="flex-1 m-5 mt-5 rounded-lg overflow-hidden">
        <ImageSlot caption="portrait photo — boxer, vertical" className="w-full h-full" radius={24} />
      </div>
      <div className="px-6 pt-8 pb-10">
        <div className="text-4xl font-bold text-obsidian leading-[40px] mb-2">BUILD YOUR PATH.</div>
        <div className="text-[15px] text-smoke mb-6">Training. Competition. Career.</div>
        <button
          onClick={() => api.goToStep(1)}
          className="w-full h-[52px] rounded-pill bg-obsidian text-bone text-[15px] font-semibold cursor-pointer mb-3"
        >
          Get Started
        </button>
        <button
          onClick={api.goToLogin}
          className="w-full h-11 bg-transparent text-obsidian text-sm font-semibold cursor-pointer"
        >
          I already have an account
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
      <div className="text-xs text-smoke mb-2">STEP 1/3</div>
      <div className="text-[28px] font-bold text-bone mb-8">WHO ARE YOU?</div>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => api.goToStep(2)}
          className="h-[88px] rounded-card bg-carbon border border-steel text-bone text-[17px] font-semibold text-left px-5 cursor-pointer"
        >
          BOXER
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
          SCOUT <span className="text-[11px] text-[#474747]">· coming later</span>
        </button>
      </div>
    </div>
  );
}

function OnboardStep2({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  return (
    <div className="absolute inset-0 bg-obsidian px-5 pt-16 pb-6 overflow-y-auto">
      <div className="h-0.5 bg-steel rounded-full mb-8">
        <div className="w-2/3 h-full bg-bone rounded-full" />
      </div>
      <div className="text-xs text-smoke mb-2">STEP 2/3</div>
      <div className="text-[28px] font-bold text-bone mb-8">YOUR BASICS</div>
      <div className="flex flex-col gap-4 mb-8">
        <Field label="First name" value={state.firstName} onChange={api.setFirstName} placeholder="Yanis" />
        <Field label="Last name" value={state.lastName} onChange={api.setLastName} placeholder="Kader" />
        <Field label="Weight class (kg)" value={state.weight} onChange={api.setWeight} placeholder="71" />
        <div>
          <div className="text-[13px] font-medium text-mist mb-2">Stance</div>
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
                {s}
              </button>
            ))}
          </div>
        </div>
        <Field
          label="Club code (optional)"
          value={state.clubCode}
          onChange={api.setClubCode}
          placeholder="ABC123"
        />
        <Field label="Email" value={state.email} onChange={api.setEmail} placeholder="you@email.com" type="email" />
        <Field
          label="Password"
          value={state.password}
          onChange={api.setPassword}
          placeholder="At least 6 characters"
          type="password"
        />
      </div>
      <button
        onClick={() => api.goToStep(3)}
        disabled={!state.firstName || !state.email || state.password.length < 6}
        className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}

function OnboardStep3({ api }: { api: BoxerAppApi }) {
  const { state } = api;
  return (
    <div className="absolute inset-0 bg-obsidian flex flex-col items-center justify-center px-6 text-center">
      <div className="text-[28px] font-bold text-bone tracking-[-0.01em] mb-8">
        YOUR PATH STARTS HERE.
      </div>
      {state.authError && (
        <div className="text-sm text-error mb-4">{state.authError}</div>
      )}
      <button
        onClick={api.enterApp}
        disabled={state.authSubmitting}
        className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer disabled:opacity-50"
      >
        {state.authSubmitting ? "Creating your account…" : "Enter RingPath"}
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
      <div className="text-[28px] font-bold text-bone mb-8">WELCOME BACK</div>
      <div className="flex flex-col gap-4 mb-6">
        <Field label="Email" value={state.email} onChange={api.setEmail} placeholder="you@email.com" type="email" />
        <Field label="Password" value={state.password} onChange={api.setPassword} placeholder="••••••••" type="password" />
      </div>
      {state.authError && <div className="text-sm text-error mb-4">{state.authError}</div>}
      <button
        onClick={api.login}
        disabled={state.authSubmitting}
        className="w-full h-[52px] rounded-pill bg-bone text-obsidian text-[15px] font-semibold cursor-pointer disabled:opacity-50 mb-3"
      >
        {state.authSubmitting ? "Logging in…" : "Log in"}
      </button>
      <button
        onClick={api.goToOnboarding}
        className="w-full h-11 bg-transparent text-bone text-sm font-semibold cursor-pointer"
      >
        Create an account instead
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
