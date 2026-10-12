import type { Metadata } from "next";
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

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
        <link rel="stylesheet" href="/css/styles.css" />
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
