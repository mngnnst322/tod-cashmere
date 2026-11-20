import { cookies } from "next/headers";
import { CATALOG_LANG_COOKIE, isCatalogLang, type CatalogLang } from "./catalog-i18n";
import { getLang } from "./i18n-server";

/** The catalog's language: its own choice, else the shop's when it has one, else Mongolian. */
export async function getCatalogLang(): Promise<CatalogLang> {
  const own = (await cookies()).get(CATALOG_LANG_COOKIE)?.value;
  if (isCatalogLang(own)) return own;
  const shop = await getLang();
  return isCatalogLang(shop) ? shop : "mn";
}
