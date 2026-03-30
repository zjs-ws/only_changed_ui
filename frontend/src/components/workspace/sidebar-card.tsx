"use client";

import type * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SidebarCard({
  title,
  children,
  className,
  contentClassName,
  labelClassName,
  ...props
}: React.ComponentProps<typeof SidebarGroup> & {
  title: React.ReactNode;
  contentClassName?: string;
  labelClassName?: string;
}) {
  return (
    <SidebarGroup
      className={cn(
        "rounded-xl border border-border/60 bg-background/30 p-2 shadow-xs backdrop-blur-sm",
        "dark:bg-[oklch(0.18_0.03_265_/_35%)]",
        className,
      )}
      {...props}
    >
      <SidebarGroupLabel
        className={cn(
          "px-2 text-[11px] font-semibold tracking-wide text-foreground/80",
          labelClassName,
        )}
      >
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent className={cn("px-1 pt-1", contentClassName)}>
        {children}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

