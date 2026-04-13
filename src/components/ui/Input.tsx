import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300",
        className
      )}
      {...props}
    />
  );
}
