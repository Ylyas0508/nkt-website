"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import zh from "./translations/zh.json";
import tr from "./translations/tr.json";

export type Locale = "en" | "ru" | "zh" | "tr";

const translations: Record<Locale, Record<string, string>> = { en, ru, zh, tr };

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("nkt_locale") as Locale;
    if (saved && translations[saved]) setLocaleState(saved);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("nkt_locale", l);
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations[locale]?.[key] ?? translations.en[key] ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
