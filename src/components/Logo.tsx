export function LogoMark({ size = 20, color = "#F5F3EE" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M15 15 H65" stroke={color} strokeWidth="12" strokeLinecap="round" />
      <path d="M85 35 V85" stroke={color} strokeWidth="12" strokeLinecap="round" />
      <path d="M85 85 H15" stroke={color} strokeWidth="12" strokeLinecap="round" />
      <path d="M15 85 V15" stroke={color} strokeWidth="12" strokeLinecap="round" />
      <path d="M50 50 L90 10" stroke={color} strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ color = "#F5F3EE", textColor }: { color?: string; textColor?: string }) {
  return (
    <div className="flex items-center gap-2">
      <LogoMark size={20} color={color} />
      <span
        className="text-[15px] font-semibold tracking-[-0.02em]"
        style={{ color: textColor ?? color }}
      >
        RINGPATH
      </span>
    </div>
  );
}
