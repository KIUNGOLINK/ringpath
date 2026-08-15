"use client";

import { useState, type ReactNode } from "react";

interface TabsProps {
  tabs: string[];
  defaultTab?: string;
  children: (active: string) => ReactNode;
  className?: string;
}

export function Tabs({ tabs, defaultTab, children, className = "" }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]);
  return (
    <div>
      <div className={`flex gap-6 border-b border-steel ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
              active === tab
                ? "text-bone border-bone"
                : "text-smoke border-transparent hover:text-mist"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="pt-6">{children(active)}</div>
    </div>
  );
}
