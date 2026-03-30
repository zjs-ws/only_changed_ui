"use client";

import { PinIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useI18n } from "@/core/i18n/hooks";
import { useThreads } from "@/core/threads/hooks";
import { pathOfThread, titleOfThread } from "@/core/threads/utils";
import { cn } from "@/lib/utils";

export function SidebarPinnedChats({
  pinnedThreadIds,
  onTogglePin,
  className,
}: {
  pinnedThreadIds: string[];
  onTogglePin: (threadId: string) => void;
  className?: string;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const { data: threads = [] } = useThreads();

  const pinnedThreads = useMemo(() => {
    if (pinnedThreadIds.length === 0) return [];
    const map = new Map(threads.map((t) => [t.thread_id, t]));
    return pinnedThreadIds.map((id) => map.get(id)).filter(Boolean);
  }, [pinnedThreadIds, threads]);

  const handleNavigateIfNeeded = useCallback(
    (threadId: string) => {
      if (pathOfThread(threadId) !== pathname) return;
      void router.push("/workspace/chats/new");
    },
    [pathname, router],
  );

  if (pinnedThreads.length === 0) {
    return (
      <div className={cn("px-1 text-xs text-muted-foreground", className)}>
        {t.sidebar.noPinnedChats}
      </div>
    );
  }

  return (
    <SidebarMenu className={cn("w-full", className)}>
      {pinnedThreads.map((thread) => {
        const isActive = pathOfThread(thread.thread_id) === pathname;
        return (
          <SidebarMenuItem key={thread.thread_id} className="group/pin-menu-item">
            <SidebarMenuButton isActive={isActive} asChild>
              <div>
                <Link
                  className="text-muted-foreground block w-full whitespace-nowrap group-hover/pin-menu-item:overflow-hidden"
                  href={pathOfThread(thread.thread_id)}
                >
                  {titleOfThread(thread)}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className="bg-background/50 hover:bg-background"
                    >
                      <PinIcon className="size-3.5" />
                      <span className="sr-only">{t.sidebar.unpin}</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-44 rounded-lg"
                    side="right"
                    align="start"
                  >
                    <DropdownMenuItem
                      onSelect={() => {
                        onTogglePin(thread.thread_id);
                        handleNavigateIfNeeded(thread.thread_id);
                      }}
                    >
                      <PinIcon className="text-muted-foreground" />
                      <span>{t.sidebar.unpin}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        onTogglePin(thread.thread_id);
                        handleNavigateIfNeeded(thread.thread_id);
                      }}
                    >
                      <span className="text-muted-foreground">
                        {t.sidebar.removeFromPinned}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

