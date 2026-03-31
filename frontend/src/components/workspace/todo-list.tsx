import { ChevronUpIcon, ListTodoIcon } from "lucide-react";
import { useMemo, useState } from "react";

import type { Todo } from "@/core/todos";
import { useI18n } from "@/core/i18n/hooks";
import { cn } from "@/lib/utils";

import {
  QueueItem,
  QueueItemContent,
  QueueItemIndicator,
  QueueList,
} from "../ai-elements/queue";

export function TodoList({
  className,
  todos,
  collapsed: controlledCollapsed,
  hidden = false,
  onToggle,
}: {
  className?: string;
  todos: Todo[];
  collapsed?: boolean;
  hidden?: boolean;
  onToggle?: () => void;
}) {
  const { locale } = useI18n();
  const [internalCollapsed, setInternalCollapsed] = useState(true);
  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const completedCount = useMemo(
    () => todos.filter((t) => t.status === "completed").length,
    [todos],
  );

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const isZh = locale === "zh-CN";

  return (
    <div
      className={cn(
        "flex h-fit w-full origin-bottom translate-y-4 flex-col overflow-hidden rounded-t-xl border border-b-0 bg-white backdrop-blur-sm transition-all duration-200 ease-out",
        hidden ? "pointer-events-none translate-y-8 opacity-0" : "",
        className,
      )}
    >
      <header
        className={cn(
          "bg-accent group flex min-h-9 shrink-0 cursor-pointer items-center justify-between gap-3 px-4 text-sm transition-all duration-300 ease-out",
        )}
        onClick={handleToggle}
      >
        <div className="text-muted-foreground flex items-center gap-2">
          <ListTodoIcon className="size-4 shrink-0" />
          <span className="font-medium">
            To-dos
            <span className="text-muted-foreground/60 ml-1.5 text-xs font-normal">
              {completedCount}/{todos.length}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground/50 text-xs opacity-0 transition-opacity group-hover:opacity-100">
            {collapsed
              ? isZh
                ? "点击展开"
                : "Click to expand"
              : isZh
                ? "点击收起"
                : "Click to collapse"}
          </span>
          <ChevronUpIcon
            className={cn(
              "text-muted-foreground size-4 transition-transform duration-300 ease-out",
              collapsed ? "" : "rotate-180",
            )}
          />
        </div>
      </header>
      <main
        className={cn(
          "bg-accent flex grow px-2 transition-all duration-300 ease-out",
          collapsed ? "h-0 pb-3" : "h-28 pb-4",
        )}
      >
        <QueueList className="bg-background mt-0 w-full rounded-t-xl">
          {todos.map((todo, i) => (
            <QueueItem key={i + (todo.content ?? "")}>
              <div className="flex items-center gap-2">
                <QueueItemIndicator
                  className={
                    todo.status === "in_progress" ? "bg-primary/70" : ""
                  }
                  completed={todo.status === "completed"}
                />
                <QueueItemContent
                  className={
                    todo.status === "in_progress" ? "text-primary/70" : ""
                  }
                  completed={todo.status === "completed"}
                >
                  {todo.content}
                </QueueItemContent>
              </div>
            </QueueItem>
          ))}
        </QueueList>
      </main>
    </div>
  );
}
