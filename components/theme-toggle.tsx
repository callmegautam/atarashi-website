"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [choice, setChoice] = useState<Theme | null>(null);

  useEffect(() => {
    if (choice === null) return;
    document.documentElement.dataset.theme = choice;
    try {
      localStorage.setItem("atarashi-theme", choice);
    } catch {}
  }, [choice]);

  return (
    <div role="group" aria-label="Colour theme" className="flex items-stretch">
      {(["light", "dark"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={active === option}
          aria-label={option === "light" ? "Light theme" : "Dark theme"}
          onClick={() => setChoice(option)}
          className={`label flex min-h-11 items-center px-3 ${
            active === option ? "bg-accent text-on-accent" : "text-text-3 hover:text-text"
          }`}
        >
          {option === "light" ? "Lt" : "Dk"}
        </button>
      ))}
    </div>
  );
}
