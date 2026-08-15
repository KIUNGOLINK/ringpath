import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRightIcon } from "@/components/icons/Icon";

type Variant = "primary" | "red" | "secondary" | "tertiary" | "small";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-[transform,background-color,opacity] duration-150 ease-[cubic-bezier(.2,.8,.2,1)] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary:
    "h-[52px] px-6 rounded-pill bg-bone text-obsidian text-[15px] hover:bg-pure-white hover:scale-[1.015] active:scale-[0.98]",
  red: "h-[52px] px-6 rounded-pill bg-fight-red text-pure-white text-[15px] hover:brightness-110 hover:scale-[1.015] active:scale-[0.98]",
  secondary:
    "h-[52px] px-6 rounded-pill bg-transparent text-bone text-[15px] border border-[#474747] hover:border-bone active:scale-[0.98]",
  tertiary:
    "h-11 px-0 bg-transparent text-bone text-[15px] hover:gap-3 active:opacity-70",
  small:
    "h-9 px-4 rounded-pill bg-bone text-obsidian text-[13px] hover:bg-pure-white active:scale-[0.98]",
};

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
      {variant === "tertiary" && <ArrowRightIcon size={16} />}
    </button>
  );
}

export function IconButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full bg-graphite text-bone border-none cursor-pointer transition-colors hover:bg-steel active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
