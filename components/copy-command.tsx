"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "copied" | "selected";

export function CopyCommand({
  command,
  size = "md",
  tone = "accent",
}: {
  command: string;
  size?: "md" | "lg";
  tone?: "accent" | "ground";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const codeRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function announce(next: Status) {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }

  function selectCommand() {
    const node = codeRef.current;
    if (!node) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    announce("selected");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      announce("copied");
    } catch {
      selectCommand();
    }
  }

  const pad = size === "lg" ? "px-6 py-7 md:px-8 md:py-9" : "px-5 py-6 md:px-7 md:py-7";
  const type =
    size === "lg" ? "text-[1rem] md:text-[1.1875rem]" : "text-[0.9375rem] md:text-[1.0625rem]";
  const surface =
    tone === "accent"
      ? "bg-accent text-on-accent hover:bg-accent-text hover:text-ground"
      : "bg-ground text-text hover:bg-ground-2";

  const label =
    status === "copied" ? "Copied" : status === "selected" ? "Select all" : "Copy";

  return (
    <button
      type="button"
      onClick={copy}
      {...(tone === "accent" ? { "data-on-accent": "" } : {})}
      aria-label={`Copy the command ${command}`}
      className={`flex w-full items-center justify-between gap-6 ${surface} ${pad} text-left active:translate-y-px`}
    >
      <code ref={codeRef} className={`font-mono ${type} min-w-0 break-words tracking-[-0.01em]`}>
        {command}
      </code>
      <span className="label shrink-0" aria-hidden="true">
        {label}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied"
          ? "Copied to clipboard"
          : status === "selected"
            ? "Command selected, press Control and C to copy"
            : ""}
      </span>
    </button>
  );
}
