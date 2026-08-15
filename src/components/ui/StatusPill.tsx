import { CheckIcon } from "@/components/icons/Icon";

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
