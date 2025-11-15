"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/config";

const AppContext = createContext();

export function AppProvider({ children }) {
  const { i18n } = useTranslation();
  
  // Always start with "light" to match server-side rendering
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage immediately after mount
  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("lang");
    const savedTheme = localStorage.getItem("theme");
    
    if (savedLang) {
      setLang(savedLang);
      i18n.changeLanguage(savedLang);
    }
    if (savedTheme) setTheme(savedTheme);
  }, [i18n]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  }, [lang, mounted, i18n]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("theme", theme);
    
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, mounted]);

  const value = {
    lang,
    setLang,
    theme,
    setTheme,
    isRTL: lang === "ar",
    isDark: theme === "dark",
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
