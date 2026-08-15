import { SparReport } from "@/components/spar/SparReport";

export const dynamic = "force-dynamic";

export default async function SparReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SparReport id={id} />;
}
