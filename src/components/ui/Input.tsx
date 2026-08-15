import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { SearchIcon } from "@/components/icons/Icon";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TextField({ label, error, className = "", id, ...props }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-mist">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`h-[52px] rounded-md bg-[#141414] border px-4 text-[16px] text-bone placeholder:text-smoke outline-none transition-colors ${
          error
            ? "border-error"
            : "border-steel focus:border-[2px] focus:border-verified"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}

export function SearchField({
  className = "",
  placeholder = "Search",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      className={`h-12 rounded-md bg-[#141414] border border-steel px-4 flex items-center gap-2 text-smoke focus-within:border-verified ${className}`}
    >
      <SearchIcon size={18} />
      <input
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[15px] text-bone placeholder:text-smoke"
        {...props}
      />
    </div>
  );
}

export function TextArea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-28 rounded-md bg-[#141414] border border-steel p-4 text-[15px] text-bone placeholder:text-smoke outline-none focus:border-[2px] focus:border-verified resize-none ${className}`}
      {...props}
    />
  );
}
