"use client";

import { useTransition } from "react";

import { Switch } from "@/components/ui/switch";

import { toggleAutomation } from "./actions";

export function AutomationToggle({
  automationKey,
  active,
}: {
  automationKey: string;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={active}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startTransition(() => toggleAutomation(automationKey, checked === true));
      }}
    />
  );
}
