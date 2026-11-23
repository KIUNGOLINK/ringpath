"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SparMark } from "@/components/spar/SparLogo";

// Sticky top bar that only appears once the visitor has scrolled past the hero,
// so the hero itself stays clean (logo + headline + two actions).
export function ScrollBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-end");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0), {
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-50 border-b border-steel bg-obsidian/80 backdrop-blur-md transition-transform duration-300 ease-[var(--ease-entrance)] ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-10">
        <Link href="/" tabIndex={visible ? 0 : -1} className="flex items-center gap-2.5 text-bone hover:text-bone">
          <SparMark size={24} />
          <span className="font-condensed text-2xl font-bold tracking-wide">SPAR</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {[
            ["Sessions", "#sessions"],
            ["Comment ça marche", "#comment-ca-marche"],
            ["Minuteur", "#minuteur"],
            ["FAQ", "#faq"],
          ].map(([label, href]) => (
            <a key={href} href={href} tabIndex={visible ? 0 : -1} className="text-mist transition-colors hover:text-bone">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/app?login=1"
            tabIndex={visible ? 0 : -1}
            className="hidden text-sm font-semibold text-bone transition-colors hover:text-mist sm:inline"
          >
            Se connecter
          </Link>
          <Link
            href="/app/spar/find"
            tabIndex={visible ? 0 : -1}
            className="inline-flex h-10 items-center rounded-pill bg-fight-red px-5 text-sm font-semibold text-pure-white transition-transform hover:scale-[1.03] hover:text-pure-white active:scale-[0.98]"
          >
            Trouver un sparring
          </Link>
        </div>
      </div>
    </div>
  );
}
