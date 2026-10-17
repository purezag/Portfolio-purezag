"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary, type Lang } from "@/lib/i18n";
import { circleReveal } from "@/lib/view-transition";

export type Theme = "light" | "dark";

type AppContextValue = {
  theme: Theme;
  lang: Lang;
  t: Dictionary;
  ready: boolean;
  landed: boolean;
  toggleTheme: () => void;
  toggleLang: () => void;
  markReady: () => void;
  markLanded: () => void;
  scrollTo: (target: string | number) => void;
  lockScroll: (locked: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [lang, setLang] = useState<Lang>("pt");
  const [ready, setReady] = useState(false);
  const [landed, setLanded] = useState(false);
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const instance = new Lenis({ autoRaf: true, lerp: reduced ? 1 : 0.085, wheelMultiplier: 0.9 });
    instance.stop();
    lenis.current = instance;
    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = dictionaries[lang].meta.htmlLang;
  }, [lang]);

  const toggleTheme = useCallback(() => {
    circleReveal(() => {
      const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
      setTheme(next);
    });
  }, []);

  const toggleLang = useCallback(() => {
    circleReveal(() => setLang((current) => (current === "pt" ? "en" : "pt")), { ring: true });
  }, []);

  const markReady = useCallback(() => {
    setReady(true);
    lenis.current?.start();
  }, []);

  const markLanded = useCallback(() => setLanded(true), []);

  const scrollTo = useCallback((target: string | number) => {
    if (typeof target === "number") {
      lenis.current?.scrollTo(target, { duration: 1.6 });
      return;
    }
    const anchor = document.querySelector<HTMLElement>(`[data-anchor="${target}"]`);
    if (!anchor) return;
    const top = anchor.getBoundingClientRect().top + window.scrollY;
    lenis.current?.scrollTo(top, { duration: 1.6 });
  }, []);

  const lockScroll = useCallback((locked: boolean) => {
    if (locked) lenis.current?.stop();
    else lenis.current?.start();
    document.documentElement.classList.toggle("is-locked", locked);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      theme,
      lang,
      t: dictionaries[lang],
      ready,
      landed,
      toggleTheme,
      toggleLang,
      markReady,
      markLanded,
      scrollTo,
      lockScroll,
    }),
    [theme, lang, ready, landed, toggleTheme, toggleLang, markReady, markLanded, scrollTo, lockScroll],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
