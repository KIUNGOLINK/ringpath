import type { Metadata } from "next";
import { ResetPassword } from "@/components/boxer/ResetPassword";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false } };

// Reached from the link in the reset email; entirely client-driven.
export const dynamic = "force-dynamic";

export default function ResetPage() {
  return <ResetPassword />;
}
