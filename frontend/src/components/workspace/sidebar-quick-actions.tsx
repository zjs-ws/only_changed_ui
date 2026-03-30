"use client";

import { BotIcon, MessageSquarePlus, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useI18n } from "@/core/i18n/hooks";
import { cn } from "@/lib/utils";

export function SidebarQuickActions({
  className,
}: {
  className?: string;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <SidebarMenu className="w-full">
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/workspace/chats/new"} asChild>
            <Link className="text-muted-foreground" href="/workspace/chats/new">
              <MessageSquarePlus size={16} />
              <span>{t.sidebar.newChat}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/workspace/chats"} asChild>
            <Link className="text-muted-foreground" href="/workspace/chats">
              <MessagesSquare size={16} />
              <span>{t.sidebar.chats}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname.startsWith("/workspace/agents")} asChild>
            <Link className="text-muted-foreground" href="/workspace/agents">
              <BotIcon size={16} />
              <span>{t.sidebar.agents}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}

