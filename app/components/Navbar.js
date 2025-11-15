"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function Navbar({ onToggleMobileMenu, showMobileMenu = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, setLang, theme, setTheme, isRTL, isDark } = useApp();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={
        (isDark ? "bg-slate-900 border-slate-800 shadow-sm" : "bg-white/70 border-slate-200 ") +
        " border-b sticky top-0 z-[60] backdrop-blur-md"
      }
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto flex max-w-[1350px] items-center lg:justify-between px-4 py-3 gap-3">
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => onToggleMobileMenu?.()}
          className={
            (isDark
              ? "border-slate-800 text-slate-300"
              : "border-slate-200 text-slate-700") +
            " md:hidden rounded-md border p-2 transition-colors"
          }
          aria-label="Toggle menu"
        >
          {showMobileMenu ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/")}
            className={
              (isDark ? "bg-white" : "bg-white") +
              " flex h-9 w-9 items-center justify-center rounded-md hover:opacity-90 transition overflow-hidden p-1"
            }
            aria-label="Go to home"
          >
            <Image 
              src="/logo.png" 
              alt="JUST BANK Logo" 
              width={32} 
              height={32}
              className="object-contain"
            />
          </button>
          <button
            onClick={() => router.push("/")}
            className={isRTL ? "text-right" : "text-left"}
          >
            <p className={(isDark ? "text-slate-100" : "text-slate-900") + " text-base font-semibold leading-tight"}>
              {t('appName')}
            </p>
            <p className={"text-sm leading-tight " + (isDark ? "text-slate-400" : "text-slate-500")}>
              {t('university')}
            </p>
          </button>
        </div>

        {/* Desktop Navigation & Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className={
              (isDark
                ? "border-slate-800 hover:bg-slate-800/50 text-slate-300"
                : "border-slate-200 hover:bg-slate-50 text-slate-700") +
              " rounded-md border px-3 py-1.5 text-sm font-medium transition"
            }
          >
            {t('langToggle')}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={
              (isDark
                ? "border-slate-800 hover:bg-slate-800/50 text-slate-300"
                : "border-slate-200 hover:bg-slate-50 text-slate-700") +
              " rounded-md border px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 transition"
            }
            aria-label={isDark ? t('themeToggleLight') : t('themeToggleDark')}
          >
            {isDark ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {isDark ? t('themeToggleLight') : t('themeToggleDark')}
          </button>
        </div>

      </div>


    </header>
  );
}
