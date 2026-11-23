"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/authErrors";
import { SparMark } from "@/components/spar/SparLogo";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { CheckIcon } from "@/components/icons/Icon";

type Status = "checking" | "ready" | "expired" | "done";

const MIN_LENGTH = 6;

export function ResetPassword() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The emailed link carries a recovery session (in the URL hash, or as ?code=). Read it explicitly:
  // this also works when the email is opened in another browser/app than the one that asked for it.
  useEffect(() => {
    let cancelled = false;
    async function init() {
      await Promise.resolve();
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const query = new URLSearchParams(window.location.search);
      const finish = (ok: boolean) => {
        window.history.replaceState(null, "", window.location.pathname);
        if (!cancelled) setStatus(ok ? "ready" : "expired");
      };

      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        return finish(!error);
      }
      const code = query.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        return finish(!error);
      }
      if (hash.get("error")) return finish(false);

      const { data } = await supabase.auth.getSession();
      if (!cancelled) setStatus(data.session ? "ready" : "expired");
    }
    void init();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const tooShort = password.length > 0 && password.length < MIN_LENGTH;
  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit = password.length >= MIN_LENGTH && password === confirm && !submitting;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(translateAuthError(updateError.message));
      setSubmitting(false);
      return;
    }
    setStatus("done");
    setTimeout(() => router.replace("/app/spar"), 1600);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian px-5 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-10 flex items-center gap-2.5 text-bone hover:text-bone">
          <SparMark size={26} />
          <span className="font-condensed text-2xl font-bold tracking-wide">SPAR</span>
        </Link>

        {status === "checking" && <div className="text-sm text-smoke">Vérification du lien…</div>}

        {status === "expired" && (
          <>
            <h1 className="mb-3 font-condensed text-4xl font-bold uppercase leading-none">Lien expiré</h1>
            <p className="mb-8 text-[15px] leading-6 text-mist">
              Ce lien n&rsquo;est plus valide, il a peut-être déjà été utilisé. Refais une demande pour en recevoir un nouveau.
            </p>
            <Link
              href="/app?login=1"
              className="flex h-[52px] items-center justify-center rounded-pill bg-bone text-[15px] font-semibold text-obsidian hover:bg-pure-white hover:text-obsidian"
            >
              Revenir à la connexion
            </Link>
          </>
        )}

        {status === "ready" && (
          <form onSubmit={submit}>
            <h1 className="mb-3 font-condensed text-4xl font-bold uppercase leading-none">Nouveau mot de passe</h1>
            <p className="mb-8 text-[15px] leading-6 text-mist">Choisis-en un que tu retiendras. Tu peux afficher ce que tu tapes avec l&rsquo;œil.</p>

            <div className="mb-5">
              <label htmlFor="new-password" className="mb-2 block text-[13px] font-medium text-mist">
                Nouveau mot de passe
              </label>
              <PasswordInput id="new-password" value={password} onChange={setPassword} placeholder="6 caractères minimum" autoComplete="new-password" />
              {tooShort && <div className="mt-2 text-[13px] text-warning">Encore {MIN_LENGTH - password.length} caractère{MIN_LENGTH - password.length > 1 ? "s" : ""} minimum.</div>}
            </div>

            <div className="mb-6">
              <label htmlFor="confirm-password" className="mb-2 block text-[13px] font-medium text-mist">
                Confirmer le mot de passe
              </label>
              <PasswordInput id="confirm-password" value={confirm} onChange={setConfirm} placeholder="Retape-le" autoComplete="new-password" />
              {mismatch && <div className="mt-2 text-[13px] text-warning">Les deux mots de passe ne sont pas identiques.</div>}
            </div>

            {error && <div className="mb-4 text-sm text-error">{error}</div>}

            <button
              type="submit"
              disabled={!canSubmit}
              className="h-[52px] w-full cursor-pointer rounded-pill border-none bg-bone text-[15px] font-semibold text-obsidian transition-opacity hover:bg-pure-white disabled:cursor-default disabled:opacity-40"
            >
              {submitting ? "Enregistrement…" : "Enregistrer"}
            </button>
          </form>
        )}

        {status === "done" && (
          <>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-carbon text-success">
              <CheckIcon size={24} />
            </div>
            <h1 className="mb-3 font-condensed text-4xl font-bold uppercase leading-none">C&rsquo;est fait</h1>
            <p className="text-[15px] leading-6 text-mist">Ton mot de passe est changé, tu es connecté. On t&rsquo;emmène sur Spar.</p>
          </>
        )}
      </div>
    </main>
  );
}
