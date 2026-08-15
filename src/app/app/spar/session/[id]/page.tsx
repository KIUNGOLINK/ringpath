import { SparSessionDetail } from "@/components/spar/SparSessionDetail";

export const dynamic = "force-dynamic";

export default async function SparSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SparSessionDetail id={id} />;
}
