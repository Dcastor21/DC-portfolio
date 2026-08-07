import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

type Props = {};

export default function ThemeToggle({}: Props) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="relative inline-flex h-7 w-14 shrink-0 items-center rounded-full
                 bg-gray-300 dark:bg-darkGreen transition-colors duration-300
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-darkGreen focus-visible:ring-offset-2"
    >
      <span
        className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white
                    shadow transition-transform duration-300 ${
                      isDark ? "translate-x-8" : "translate-x-1"
                    }`}
      >
        {isDark ? (
          <MoonIcon className="h-3 w-3 text-darkGreen" />
        ) : (
          <SunIcon className="h-3 w-3 text-yellow-500" />
        )}
      </span>
    </button>
  );
}
