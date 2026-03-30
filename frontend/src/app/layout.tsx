import "@/styles/globals.css";
import "katex/dist/katex.min.css";

import { type Metadata } from "next";
import { JetBrains_Mono, ZCOOL_KuaiLe } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/core/i18n/context";
import { detectLocaleServer } from "@/core/i18n/server";

const zcoolKuaiLe = ZCOOL_KuaiLe({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-next",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-next",
});

export const metadata: Metadata = {
  title: "MyAgent",
  description: "An AI agent workspace.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await detectLocaleServer();
  return (
    <html
      lang={locale}
      suppressContentEditableWarning
      suppressHydrationWarning
      className={`${zcoolKuaiLe.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="icon" href="/images/favicon.svg" />
      </head>
      <body>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <I18nProvider initialLocale={locale}>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
