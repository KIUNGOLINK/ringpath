import { SparHome } from "@/components/spar/SparHome";

// Auth-gated and entirely client-driven — never statically prerender.
export const dynamic = "force-dynamic";

export default function SparPage() {
  return <SparHome />;
}
