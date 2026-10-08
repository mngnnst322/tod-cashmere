import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { LangProvider } from "@/components/lang-provider";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Tod Cashmere",
  description: "Premium Mongolian cashmere.",
};

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
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <LangProvider initialLang={lang}>
          <CartProvider>{children}</CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
