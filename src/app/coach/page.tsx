import { CoachDashboard } from "@/components/coach/CoachDashboard";

// Auth-gated and entirely client-driven — never statically prerender.
export const dynamic = "force-dynamic";

export default function CoachPage() {
  return <CoachDashboard />;
}
