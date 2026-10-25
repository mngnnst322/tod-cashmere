import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ClerkProvider } from "@clerk/nextjs";
import { enUS, mnMN, ruRU, zhCN } from "@clerk/localizations";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { LangProvider } from "@/components/lang-provider";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Tod Cashmere",
  description: "Premium Mongolian cashmere.",
};

const clerkLocalizations = { mn: mnMN, en: enUS, ru: ruRU, zh: zhCN };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [lang, cookieStore] = await Promise.all([getLang(), cookies()]);
  // The light/dark choice is a cookie so the server renders it directly;
  // with no choice yet, CSS follows the device setting.
  const themeCookie = cookieStore.get("theme")?.value;
  const theme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : undefined;
  return (
    <html lang={lang} data-theme={theme} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href={`/css/styles.css?v=${process.env.NEXT_PUBLIC_ASSET_VERSION}`} />
      </head>
      <body>
        <ClerkProvider localization={clerkLocalizations[lang]}>
          <LangProvider initialLang={lang}>
            <CartProvider>{children}</CartProvider>
          </LangProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
