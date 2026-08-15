import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number, props: IconProps) {
  const rest = { ...props };
  delete rest.size;
  return { width: size, height: size, viewBox: "0 0 24 24", fill: "none", ...rest };
}

export function BellIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function PauseIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

export function StarIcon({ size = 16, filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size, props)} fill={filled ? "currentColor" : "none"}>
      <path
        d="M12 2.5l2.9 6.14 6.6.77-4.9 4.55 1.28 6.6L12 17.4l-5.88 3.16 1.28-6.6-4.9-4.55 6.6-.77L12 2.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
