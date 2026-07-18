"use client";

import React from "react";
import { useTheme } from "../lib/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 left-5 z-50 p-2.5 rounded-full border border-accent-gray bg-bg-primary text-text-primary shadow-xs transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={16} strokeWidth={1.5} /> : <Sun size={16} strokeWidth={1.5} />}
    </button>
  );
}
