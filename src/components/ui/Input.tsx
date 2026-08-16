import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-ink-200 dark:border-transparent bg-surface dark:bg-control px-3 text-sm text-ink-900 dark:text-ink-50 outline-none transition-colors placeholder:text-ink-400 dark:placeholder:text-ink-600 hover:border-ink-300 dark:hover:border-ink-700 focus:border-navy-500 dark:focus:border-navy-400 focus:ring-2 focus:ring-navy-500/20",
        className
      )}
      {...props}
    />
  );
}
