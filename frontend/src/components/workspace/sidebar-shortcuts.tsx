"use client";

import { InfoIcon, PaletteIcon, Settings2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/core/i18n/hooks";
import { cn } from "@/lib/utils";

import { SettingsDialog } from "./settings/settings-dialog";

type SettingsSection =
  | "appearance"
  | "memory"
  | "tools"
  | "skills"
  | "notification"
  | "about";

export function SidebarShortcuts({
  className,
}: {
  className?: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [defaultSection, setDefaultSection] =
    useState<SettingsSection>("appearance");

  return (
    <div className={cn("grid grid-cols-2 gap-2 px-1", className)}>
      <SettingsDialog
        open={open}
        onOpenChange={setOpen}
        defaultSection={defaultSection}
      />
      <Button
        variant="outline"
        className="h-9 min-w-0 justify-start gap-2 text-xs"
        onClick={() => {
          setDefaultSection("appearance");
          setOpen(true);
        }}
      >
        <PaletteIcon className="size-4 opacity-80" />
        <span className="truncate">{t.settings.sections.appearance}</span>
      </Button>
      <Button
        variant="outline"
        className="h-9 min-w-0 justify-start gap-2 text-xs"
        onClick={() => {
          setDefaultSection("about");
          setOpen(true);
        }}
      >
        <InfoIcon className="size-4 opacity-80" />
        <span className="truncate">{t.settings.sections.about}</span>
      </Button>
      <Button
        variant="outline"
        className="h-9 min-w-0 justify-start gap-2 text-xs"
        onClick={() => {
          setDefaultSection("tools");
          setOpen(true);
        }}
      >
        <Settings2Icon className="size-4 opacity-80" />
        <span className="truncate">{t.settings.sections.tools}</span>
      </Button>
      <Button
        variant="outline"
        className="h-9 min-w-0 justify-start gap-2 text-xs"
        onClick={() => {
          setDefaultSection("skills");
          setOpen(true);
        }}
      >
        <Settings2Icon className="size-4 opacity-80" />
        <span className="truncate">{t.settings.sections.skills}</span>
      </Button>
    </div>
  );
}

