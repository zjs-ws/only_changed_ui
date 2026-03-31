"use client";

import { GlobeIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { isLocale, type Locale } from "@/core/i18n";
import { useI18n } from "@/core/i18n/hooks";
import { cn } from "@/lib/utils";

const THEME_CYCLE: ("system" | "light" | "dark")[] = [
  "system",
  "light",
  "dark",
];

const LOCALE_CYCLE: Locale[] = ["zh-CN", "en-US"];

export function SidebarStatus({ className }: { className?: string }) {
  const { t, locale, changeLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (theme ?? "system") as "system" | "light" | "dark";

  const themeLabel = useMemo(() => {
    if (!mounted) return "";
    if (currentTheme === "system") return t.settings.appearance.system;
    if (currentTheme === "light") return t.settings.appearance.light;
    return t.settings.appearance.dark;
  }, [mounted, currentTheme, t]);

  const ThemeIcon = useMemo(() => {
    if (!mounted) return MonitorIcon;
    if (currentTheme === "system") return MonitorIcon;
    if (currentTheme === "light") return SunIcon;
    return MoonIcon;
  }, [mounted, currentTheme]);

  const cycleTheme = useCallback(() => {
    const idx = THEME_CYCLE.indexOf(currentTheme);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]!;
    setTheme(next);
  }, [currentTheme, setTheme]);

  const cycleLocale = useCallback(() => {
    const idx = LOCALE_CYCLE.indexOf(locale as Locale);
    const next = LOCALE_CYCLE[(idx + 1) % LOCALE_CYCLE.length]!;
    if (isLocale(next)) {
      changeLocale(next);
    }
  }, [locale, changeLocale]);

  const localeLabel = useMemo(() => {
    return locale === "zh-CN" ? "中文" : "English";
  }, [locale]);

  return (
    <div className={cn("flex flex-col gap-2 px-1", className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{t.sidebar.theme}</span>
        {mounted ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1.5 px-2 text-xs font-medium"
            onClick={cycleTheme}
          >
            <ThemeIcon className="size-3" />
            {themeLabel}
          </Button>
        ) : (
          <span className="text-xs font-medium">—</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">
          {t.settings.appearance.languageTitle}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1.5 px-2 text-xs font-medium"
          onClick={cycleLocale}
        >
          <GlobeIcon className="size-3" />
          {localeLabel}
        </Button>
      </div>
    </div>
  );
}

