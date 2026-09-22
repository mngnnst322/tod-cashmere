"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dictionary, type DictKey, type Lang } from "@/lib/i18n";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: DictKey) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("mn");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )lang=(mn|en)/);
    // One-time hydration read: the cookie isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setLangState(match[1] as Lang);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    document.cookie = `lang=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };

  const t = (key: DictKey) => dictionary[lang][key];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
