import { BoxerApp } from "@/components/boxer/BoxerApp";

// Auth-gated and entirely client-driven — never statically prerender.
export const dynamic = "force-dynamic";

export default function AppPage() {
  return <BoxerApp />;
}
