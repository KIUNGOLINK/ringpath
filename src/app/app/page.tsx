import { BoxerApp } from "@/components/boxer/BoxerApp";

// Auth-gated and entirely client-driven — never statically prerender.
export const dynamic = "force-dynamic";

export default function AppPage() {
  return (
    <div className="flex justify-center px-4 py-12 pb-32">
      <BoxerApp />
    </div>
  );
}
