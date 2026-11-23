"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons/Icon";

// Password input with a show/hide eye, so nobody has to type blind.
export function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: "current-password" | "new-password";
  id?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        className="w-full h-[52px] rounded-md bg-[#141414] border border-steel pl-4 pr-12 text-[16px] text-bone placeholder:text-smoke outline-none focus:border-verified"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
        className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-smoke transition-colors hover:text-bone"
      >
        {visible ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
      </button>
    </div>
  );
}
