export function SparMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M15 15 H65" stroke="#F5F3EE" strokeWidth="12" strokeLinecap="round" />
      <path d="M85 35 V85" stroke="#F5F3EE" strokeWidth="12" strokeLinecap="round" />
      <path d="M85 85 H35" stroke="#F5F3EE" strokeWidth="12" strokeLinecap="round" />
      <path d="M15 65 V15" stroke="#F5F3EE" strokeWidth="12" strokeLinecap="round" />
      <path d="M10 90 L90 10" stroke="#E31B23" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}
