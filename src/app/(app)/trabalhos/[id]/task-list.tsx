"use client";

import { useRef, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { addJobTask, toggleJobTask } from "./actions";

type Task = { id: string; title: string; done: boolean };

export function TaskList({ jobId, tasks }: { jobId: string; tasks: Task[] }) {
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 border-b py-2.5 last:border-b-0"
          >
            <Checkbox
              checked={task.done}
              onCheckedChange={(checked) =>
                startTransition(() =>
                  toggleJobTask(jobId, task.id, checked === true)
                )
              }
            />
            <span
              className={
                task.done
                  ? "text-sm text-muted-foreground line-through"
                  : "text-sm"
              }
            >
              {task.title}
            </span>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="py-2 text-sm text-muted-foreground">
            Sem tarefas ainda.
          </p>
        )}
      </div>

      <form
        className="flex gap-2"
        action={(formData) => {
          const title = String(formData.get("title") ?? "");
          startTransition(() => addJobTask(jobId, title));
          if (inputRef.current) inputRef.current.value = "";
        }}
      >
        <Input
          ref={inputRef}
          name="title"
          placeholder="Nova tarefa…"
          disabled={isPending}
        />
        <Button type="submit" variant="outline" disabled={isPending}>
          Adicionar
        </Button>
      </form>
    </div>
  );
}
