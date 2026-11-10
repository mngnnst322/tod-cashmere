import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { enUS, mnMN, ruRU, zhCN } from "@clerk/localizations";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { LangProvider } from "@/components/lang-provider";
import { getLang } from "@/lib/i18n-server";
import { getPricing } from "@/lib/pricing";
import { PricingProvider } from "@/components/pricing-provider";

export const metadata: Metadata = {
  title: "Tod Cashmere",
  description: "Premium Mongolian cashmere.",
};

const clerkLocalizations = { mn: mnMN, en: enUS, ru: ruRU, zh: zhCN };

// Busts the browser cache for /css/styles.css: per build in production, per
// page load in development (where the file changes without a rebuild).
const assetVersion = () =>
  process.env.NODE_ENV === "development" ? Date.now().toString(36) : process.env.NEXT_PUBLIC_ASSET_VERSION;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [lang, pricing] = await Promise.all([getLang(), getPricing()]);
  // Light only: the site has no dark mode, and the fixed theme stops the CSS
  // from following the device's dark setting.
  return (
    <html lang={lang} data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
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
        <link rel="stylesheet" href={`/css/styles.css?v=${assetVersion()}`} />
      </head>
      <body>
        <ClerkProvider localization={clerkLocalizations[lang]}>
          <PricingProvider pricing={pricing}>
            <LangProvider initialLang={lang}>
              <CartProvider>{children}</CartProvider>
            </LangProvider>
          </PricingProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
