"use client";

import { useTransition } from "react";

import { Checkbox } from "@/components/ui/checkbox";

import { toggleTaskDone } from "./actions";

export function TaskCheckbox({
  taskId,
  done,
}: {
  taskId: string;
  done: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Checkbox
      checked={done}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startTransition(() => {
          toggleTaskDone(taskId, checked === true);
        });
      }}
    />
  );
}
