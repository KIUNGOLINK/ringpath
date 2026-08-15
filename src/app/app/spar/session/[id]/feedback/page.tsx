import { SparFeedback } from "@/components/spar/SparFeedback";

export const dynamic = "force-dynamic";

export default async function SparFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SparFeedback id={id} />;
}
