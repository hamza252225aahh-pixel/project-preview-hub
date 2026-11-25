import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { LANGUAGE_KEY, resolveLanguage, type AppLanguage } from "@/quran/lib/language";
import { ENGLISH } from "@/quran/lib/translations";

type LanguageContextValue = {
  language: AppLanguage; dir: "rtl" | "ltr"; locale: string;
  setLanguage: (language: AppLanguage) => void;
  t: (text: string, ...values: (string | number)[]) => string;
};
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<AppLanguage>("ar");
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(LANGUAGE_KEY); } catch { /* Storage may be restricted. */ }
    updateLanguage(resolveLanguage(saved, navigator.language));
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);
  const setLanguage = useCallback((next: AppLanguage) => {
    updateLanguage(next);
    try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* Still usable without storage. */ }
  }, []);
  const t = useCallback((text: string, ...values: (string | number)[]) => {
    const translated = language === "en" ? ENGLISH[text.trim()] ?? text : text;
    return translated.replace(/\{(\d+)\}/g, (match, n: string) => String(values[Number(n)] ?? match));
  }, [language]);
  return <LanguageContext.Provider value={{ language, dir: language === "ar" ? "rtl" : "ltr", locale: language === "ar" ? "ar-SA" : "en-US", setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("LanguageProvider is required");
  return context;
}