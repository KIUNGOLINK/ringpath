"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUpCoach } from "@/lib/supabase/queries";
import { translateAuthError } from "@/lib/authErrors";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Input";

export function CoachSignup() {
  const router = useRouter();
  const supabase = createClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clubName, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clubCode, setClubCode] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await signUpCoach(supabase, { email, password, firstName, lastName, clubName });
      if (result.needsEmailConfirmation) {
        setError("Vérifie ton email pour confirmer ton compte, puis connecte-toi.");
        setSubmitting(false);
        return;
      }
      setClubCode(result.clubCode);
    } catch (err) {
      setError(err instanceof Error ? translateAuthError(err.message) : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  if (clubCode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-2xl font-bold text-bone mb-3">C&rsquo;est prêt.</div>
          <div className="text-smoke mb-6">
            Partage ce code avec tes boxeurs et boxeuses pour qu&rsquo;ils lient leur compte à {clubName || "ton club"}.
          </div>
          <div className="font-condensed text-6xl font-bold text-bone tracking-[0.1em] mb-8 bg-carbon rounded-card py-8">
            {clubCode}
          </div>
          <Button variant="primary" onClick={() => router.push("/coach")}>
            Aller au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <form onSubmit={handleSubmit} className="max-w-md w-full">
        <div className="mb-10">
          <Logo />
        </div>
        <div className="text-2xl font-bold text-bone mb-8">Crée ton compte coach</div>
        <div className="flex flex-col gap-4 mb-6">
          <TextField label="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <TextField label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <TextField label="Nom du club" value={clubName} onChange={(e) => setClubName(e.target.value)} placeholder="Boxing Club de Belleville" required />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        {error && <div className="text-sm text-error mb-4">{error}</div>}
        <Button variant="primary" type="submit" disabled={submitting} className="w-full mb-4">
          {submitting ? "Création du compte…" : "Créer le compte"}
        </Button>
        <div className="text-sm text-smoke text-center">
          Déjà un compte ?{" "}
          <Link href="/coach/login" className="text-bone font-semibold">
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
}
