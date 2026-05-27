"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { dictionary, type Locale, type Dictionary } from "./dictionary";

interface I18nValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: Dictionary;
  /** interpolate {placeholders}: tf("Step {n} of {total}", { n: 1, total: 8 }) */
  tf: (template: string, vars: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "manfath.locale";

export function I18nProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // hydrate from storage once on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    // Intentional post-mount sync: reading localStorage on the server would
    // cause a hydration mismatch, so we reconcile the persisted locale here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored && stored !== locale) setLocaleState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reflect locale onto <html> and persist
  useEffect(() => {
    const dir = dictionary[locale].dir as "ltr" | "rtl";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggle = useCallback(
    () => setLocaleState((p) => (p === "en" ? "ar" : "en")),
    [],
  );

  const tf = useCallback(
    (template: string, vars: Record<string, string | number>) =>
      template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)),
    [],
  );

  const value: I18nValue = {
    locale,
    dir: dictionary[locale].dir as "ltr" | "rtl",
    setLocale,
    toggle,
    t: dictionary[locale],
    tf,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
