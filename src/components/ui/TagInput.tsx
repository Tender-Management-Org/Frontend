"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string; // comma-separated string stored in form state
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Tag / chip input. Type text + press Enter (or comma) to add a chip.
 * Stored as a comma-separated string externally.
 */
export function TagInput({ value, onChange, placeholder = "Type and press Enter…", className }: TagInputProps) {
  const tags = value
    ? value.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    const next = [...tags, trimmed];
    onChange(next.join(", "));
    setInputValue("");
  }

  function removeTag(index: number) {
    const next = tags.filter((_, i) => i !== index);
    onChange(next.join(", "));
    inputRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  return (
    <div
      className={`min-h-[44px] w-full cursor-text rounded-lg border border-border bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-slate-300 ${className ?? ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-800 border border-navy-200"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              className="ml-0.5 rounded-sm text-navy-500 hover:text-navy-800 focus:outline-none"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[160px] flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
        />
      </div>
    </div>
  );
}
