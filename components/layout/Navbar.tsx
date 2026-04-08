"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useTranslation, Locale } from "@/lib/i18n";

const LANGS: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
];

export default function Navbar() {
  const { t, locale, setLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { key: "nav.home", href: "#home" },
    { key: "nav.about", href: "#about" },
    { key: "nav.products", href: "#products" },
    { key: "nav.blog", href: "#blog" },
    { key: "nav.contact", href: "#contact" },
  ];

  const currentLang = LANGS.find((l) => l.code === locale) || LANGS[0];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(10, 22, 40, 0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(205,158,102,0.15)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="Nanning Kazan Trading Co., Ltd"
            className="w-14 h-14 object-contain drop-shadow-lg"
            style={{ filter: "drop-shadow(0 2px 6px rgba(205,158,102,0.3))" }}
          />
          <div className="hidden sm:block">
            <div className="text-white font-semibold text-sm leading-tight">Nanning Kazan</div>
            <div className="text-xs leading-tight" style={{ color: "#cd9e66" }}>Trading Co., Ltd</div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-md transition-colors hover:bg-white/5"
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white transition-colors border border-white/10 hover:border-white/20 bg-white/5"
            >
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline font-medium">{currentLang.code.toUpperCase()}</span>
              <ChevronDown size={14} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 rounded-xl shadow-2xl overflow-hidden w-40"
                  style={{ background: "#0f2039", border: "1px solid rgba(205,158,102,0.2)" }}
                >
                  {LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors hover:bg-white/5"
                      style={{ color: locale === lang.code ? "#cd9e66" : "rgba(255,255,255,0.8)" }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {locale === lang.code && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact CTA button (desktop) */}
          <a
            href="#contact"
            className="hidden md:block px-4 py-2 rounded-lg text-sm font-semibold text-navy-900 transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)" }}
          >
            {t("nav.contact")}
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: "rgba(10, 22, 40, 0.98)", borderTop: "1px solid rgba(205,158,102,0.15)" }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  {t(link.key)}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
