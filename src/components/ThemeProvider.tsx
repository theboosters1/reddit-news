import React, { useState, useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return (saved as "light" | "dark") || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className="min-h-screen bg-reddit-bg text-reddit-text-main transition-colors duration-300">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-reddit-surface border border-reddit-border hover:scale-110 transition-transform shadow-sm"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
      {children}
    </div>
  );
}
