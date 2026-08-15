import { CheckIcon } from "@/components/icons/Icon";

const ANNOTATION_STYLES = {
  good: { bg: "#30D158", text: "#070707", label: "GOOD" },
  improve: { bg: "#FFB020", text: "#070707", label: "IMPROVE" },
  mistake: { bg: "#E5484D", text: "#070707", label: "MISTAKE" },
  tactical: { bg: "#7DD3FC", text: "#070707", label: "TACTICAL" },
} as const;

export type AnnotationType = keyof typeof ANNOTATION_STYLES;

export function AnnotationPill({ type }: { type: AnnotationType }) {
  const s = ANNOTATION_STYLES[type];
  return (
    <span
      className="text-[11px] font-semibold tracking-[0.04em] px-2.5 py-[3px] rounded-pill"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

export function VerifiedRow({
  label,
  status,
}: {
  label: string;
  status: "verified" | "confirmed" | "pending";
}) {
  const config = {
    verified: { text: "Verified", color: "#1E824C", icon: true },
    confirmed: { text: "Confirmed", color: "#2E6BD6", icon: false },
    pending: { text: "Pending", color: "#767676", icon: false },
  }[status];
  return (
    <div className="flex justify-between pb-4 border-b border-passport-border">
      <span className="text-[15px] text-obsidian">{label}</span>
      <span className="text-sm font-semibold flex items-center gap-1" style={{ color: config.color }}>
        {config.icon && <CheckIcon size={13} />}
        {config.text}
      </span>
    </div>
  );
}

export function ConfirmedBadge({ label = "COACH CONFIRMED" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-passport-chip px-4 py-2 rounded-pill">
      <span className="w-1.5 h-1.5 rounded-full bg-verified" />
      <span className="text-[13px] font-semibold text-obsidian">{label}</span>
    </div>
  );
}

export function WinLossBadge({ result }: { result: "win" | "loss" }) {
  const win = result === "win";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide px-2 py-1 rounded-sm"
      style={{
        color: win ? "#30D158" : "#E5484D",
        background: win ? "rgba(48,209,88,0.12)" : "rgba(229,72,77,0.12)",
      }}
    >
      {win ? "WIN" : "LOSS"}
    </span>
  );
}
