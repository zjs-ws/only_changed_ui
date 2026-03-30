"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isLocale } from "@/core/i18n";
import { cn } from "@/lib/utils";
import { env } from "@/env";
import { useI18n } from "@/core/i18n/hooks";

export function SidebarStatus({ className }: { className?: string }) {
  const { t, locale, changeLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const [online, setOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const themeValue = useMemo(
    () => (mounted ? (theme ?? "system") : "system"),
    [mounted, theme],
  );

  return (
    <div className={cn("flex flex-col gap-2 px-1", className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{t.sidebar.connection}</span>
        <Badge variant={online ? "secondary" : "destructive"}>
          {online ? t.sidebar.online : t.sidebar.offline}
        </Badge>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{t.sidebar.theme}</span>
        <Select
          value={themeValue}
          onValueChange={(value) =>
            setTheme(value as "system" | "light" | "dark")
          }
        >
          <SelectTrigger className="h-7 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">{t.settings.appearance.system}</SelectItem>
            <SelectItem value="light">{t.settings.appearance.light}</SelectItem>
            <SelectItem value="dark">{t.settings.appearance.dark}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">
          {t.settings.appearance.languageTitle}
        </span>
        <Select
          value={locale}
          onValueChange={(value) => {
            if (isLocale(value)) {
              changeLocale(value);
            }
          }}
        >
          <SelectTrigger className="h-7 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh-CN">中文</SelectItem>
            <SelectItem value="en-US">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{t.sidebar.mode}</span>
        <span className="truncate font-medium">
          {env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY === "true"
            ? t.sidebar.demo
            : t.sidebar.live}
        </span>
      </div>
    </div>
  );
}

