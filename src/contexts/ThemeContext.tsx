"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type ThemePreference = Theme;

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  switchable: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

function getStoredPreference(): ThemePreference | null {
  try {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("theme");
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = true,
}: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(defaultTheme);
  const [mounted, setMounted] = useState(false);
  const theme = preference;

  useEffect(() => {
    setMounted(true);
    const stored = getStoredPreference();
    if (stored) {
      setPreference(stored);
      const root = document.documentElement;
      root.classList.toggle("dark", stored === "dark");
      root.style.colorScheme = stored;
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;

    if (switchable) {
      try {
        window.localStorage.setItem("theme", theme);
      } catch {
        // Continue gracefully when storage is unavailable.
      }
    }
  }, [theme, switchable, mounted]);

  const setThemePreference = (nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    const root = document.documentElement;
    root.classList.toggle("dark", nextPreference === "dark");
    root.style.colorScheme = nextPreference;
    try {
      window.localStorage.setItem("theme", nextPreference);
    } catch {}
  };

  const toggleTheme = () => {
    setThemePreference(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, preference, setThemePreference, toggleTheme, switchable, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

