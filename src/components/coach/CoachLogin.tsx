"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Input";

export function CoachLogin() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }
    router.push("/coach");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <form onSubmit={handleSubmit} className="max-w-md w-full">
        <div className="mb-10">
          <Logo />
        </div>
        <div className="text-2xl font-bold text-bone mb-8">Coach log in</div>
        <div className="flex flex-col gap-4 mb-6">
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-sm text-error mb-4">{error}</div>}
        <Button variant="primary" type="submit" disabled={submitting} className="w-full mb-4">
          {submitting ? "Logging in…" : "Log in"}
        </Button>
        <div className="text-sm text-smoke text-center">
          New here?{" "}
          <Link href="/coach/signup" className="text-bone font-semibold">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
