"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Web" },
  { href: "/app", label: "Boxer App" },
  { href: "/passport/yanis-kader", label: "Passport" },
  { href: "/coach", label: "Coach" },
  { href: "/scouting", label: "Scouting" },
  { href: "/foundations", label: "Foundations" },
  { href: "/components", label: "Components" },
];

export function DemoNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-1 rounded-pill px-2 py-2 backdrop-blur-md overflow-x-auto max-w-[94vw]"
      style={{ background: "rgba(16,16,16,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
      aria-label="Demo navigation"
    >
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-pill transition-colors ${
              active ? "bg-bone text-obsidian" : "text-mist hover:text-bone"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
