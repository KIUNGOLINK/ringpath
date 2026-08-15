"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUpCoach } from "@/lib/supabase/queries";
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
        setError("Check your email to confirm your account, then log in.");
        setSubmitting(false);
        return;
      }
      setClubCode(result.clubCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (clubCode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-2xl font-bold text-bone mb-3">You&rsquo;re all set.</div>
          <div className="text-smoke mb-6">
            Share this code with your boxers so they can link their account to {clubName || "your club"}.
          </div>
          <div className="font-condensed text-6xl font-bold text-bone tracking-[0.1em] mb-8 bg-carbon rounded-card py-8">
            {clubCode}
          </div>
          <Button variant="primary" onClick={() => router.push("/coach")}>
            Go to dashboard
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
        <div className="text-2xl font-bold text-bone mb-8">Create your coach account</div>
        <div className="flex flex-col gap-4 mb-6">
          <TextField label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <TextField label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <TextField label="Club name" value={clubName} onChange={(e) => setClubName(e.target.value)} placeholder="Belleville Boxing Club" required />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        {error && <div className="text-sm text-error mb-4">{error}</div>}
        <Button variant="primary" type="submit" disabled={submitting} className="w-full mb-4">
          {submitting ? "Creating account…" : "Create account"}
        </Button>
        <div className="text-sm text-smoke text-center">
          Already have an account?{" "}
          <Link href="/coach/login" className="text-bone font-semibold">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
