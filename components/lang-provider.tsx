"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { dictionary, type Dict, type Lang } from "@/lib/i18n";

type StringKey = {
  [K in keyof Dict]: Dict[K] extends string ? K : never;
}[keyof Dict];

type LangContextValue = {
  lang: Lang;
  dict: Dict;
  setLang: (lang: Lang) => void;
  t: (key: StringKey) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = (next: Lang) => {
    setLangState(next);
    document.cookie = `lang=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = next;
    // Server components read the cookie, so re-render them in the new language.
    router.refresh();
  };

  const dict = dictionary[lang];
  const t = (key: StringKey) => dict[key];

  return (
    <LangContext.Provider value={{ lang, dict, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
