import type { ReactNode } from "react";

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center h-9 px-4 rounded-pill bg-graphite text-bone text-[13px] font-semibold whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}
