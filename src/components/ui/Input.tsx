import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 hover:border-ink-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20",
        className
      )}
      {...props}
    />
  );
}
