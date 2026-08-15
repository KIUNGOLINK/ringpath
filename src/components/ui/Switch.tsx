"use client";

import { useState } from "react";

export function Switch({
  defaultChecked = false,
  onChange,
  label,
}: {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => {
        const next = !checked;
        setChecked(next);
        onChange?.(next);
      }}
      className={`relative w-12 h-7 rounded-pill transition-colors cursor-pointer shrink-0 ${
        checked ? "bg-bone" : "bg-steel"
      }`}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full transition-transform ${
          checked ? "translate-x-[22px] bg-obsidian" : "translate-x-0.5 bg-smoke"
        }`}
      />
    </button>
  );
}
