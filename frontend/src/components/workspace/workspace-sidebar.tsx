"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useLocalSettings } from "@/core/settings";
import { useI18n } from "@/core/i18n/hooks";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";

import { RecentChatList } from "./recent-chat-list";
import { SidebarCard } from "./sidebar-card";
import { SidebarPinnedChats } from "./sidebar-pinned";
import { SidebarQuickActions } from "./sidebar-quick-actions";
import { SidebarShortcuts } from "./sidebar-shortcuts";
import { SidebarStatus } from "./sidebar-status";
import { WorkspaceHeader } from "./workspace-header";

export function WorkspaceSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { open: isSidebarOpen } = useSidebar();
  const { t } = useI18n();
  const [settings, setSettings] = useLocalSettings();
  const [recentQuery, setRecentQuery] = useState("");

  const pinnedThreadIds = useMemo(
    () => settings.layout.pinned_thread_ids ?? [],
    [settings.layout.pinned_thread_ids],
  );

  const togglePin = useCallback(
    (threadId: string) => {
      const set = new Set(pinnedThreadIds);
      if (set.has(threadId)) {
        set.delete(threadId);
      } else {
        set.add(threadId);
      }
      setSettings("layout", { pinned_thread_ids: Array.from(set) });
    },
    [pinnedThreadIds, setSettings],
  );
  return (
    <>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="dark:glass-panel dark:neon-border"
        {...props}
      >
        <SidebarHeader className="py-0">
          <WorkspaceHeader />
        </SidebarHeader>
        <SidebarContent className="gap-2 px-2 py-2">
          <SidebarCard
            title={t.sidebar.navigation}
            labelClassName="group-data-[collapsible=icon]:hidden"
            className={cn(
              "group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none",
              "group-data-[collapsible=icon]:p-0",
            )}
            contentClassName="group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:pt-0"
          >
            <SidebarQuickActions />
          </SidebarCard>

          <SidebarCard
            title={t.sidebar.pinned}
            className="group-data-[collapsible=icon]:hidden"
          >
            <SidebarPinnedChats
              pinnedThreadIds={pinnedThreadIds}
              onTogglePin={togglePin}
            />
          </SidebarCard>

          <SidebarCard
            title={t.sidebar.recentChats}
            className="group-data-[collapsible=icon]:hidden"
            contentClassName="min-h-0"
          >
            <div className="px-1 pb-2">
              <Input
                value={recentQuery}
                onChange={(e) => setRecentQuery(e.target.value)}
                placeholder={t.chats.searchChats}
                className="h-8"
              />
            </div>
            <div className="min-h-0">
              <RecentChatList
                query={recentQuery}
                pinnedThreadIds={pinnedThreadIds}
                onTogglePin={togglePin}
              />
            </div>
          </SidebarCard>

          <SidebarCard
            title={t.sidebar.shortcuts}
            className="group-data-[collapsible=icon]:hidden"
          >
            <SidebarShortcuts />
          </SidebarCard>

          <SidebarCard
            title={t.sidebar.status}
            className="group-data-[collapsible=icon]:hidden"
          >
            <SidebarStatus />
          </SidebarCard>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
