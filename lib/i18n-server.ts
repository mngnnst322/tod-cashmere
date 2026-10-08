import { cookies } from "next/headers";
import { DEFAULT_LANG, dictionary, isLang, type Lang } from "./i18n";

export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get("lang")?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}

export async function getDict() {
  const lang = await getLang();
  return { lang, dict: dictionary[lang] };
}
