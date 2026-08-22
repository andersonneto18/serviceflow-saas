"use client";

import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";

import { updateTaskStatus } from "./actions";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  clientName: string | null;
  assignedToName: string | null;
};

const COLUMNS: { status: Task["status"]; label: string }[] = [
  { status: "todo", label: "To Do" },
  { status: "in_progress", label: "In Progress" },
  { status: "done", label: "Done" },
];

const PRIORITY_VARIANT: Record<string, string> = {
  baixa: "bg-muted text-muted-foreground",
  normal: "bg-primary/10 text-primary",
  alta: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  urgente: "bg-destructive/10 text-destructive",
};

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [, startTransition] = useTransition();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  function moveTask(taskId: string, status: string) {
    startTransition(() =>
      updateTaskStatus(taskId, status as "todo" | "in_progress" | "done")
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.status);
        return (
          <div
            key={column.status}
            className={
              dragOverColumn === column.status
                ? "flex flex-col gap-2 rounded-lg border-2 border-dashed border-primary bg-primary/5 p-2"
                : "flex flex-col gap-2 rounded-lg border-2 border-dashed border-transparent p-2"
            }
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverColumn(column.status);
            }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => {
              e.preventDefault();
              const taskId = e.dataTransfer.getData("text/plain");
              if (taskId) moveTask(taskId, column.status);
              setDragOverColumn(null);
              setDraggingId(null);
            }}
          >
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold">{column.label}</h2>
              <span className="text-xs text-muted-foreground">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex min-h-16 flex-col gap-2">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", task.id);
                    setDraggingId(task.id);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  className={
                    draggingId === task.id
                      ? "cursor-grab rounded-lg border bg-card p-3 opacity-40 shadow-sm"
                      : "cursor-grab rounded-lg border bg-card p-3 shadow-sm"
                  }
                >
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {task.clientName ?? "Sem cliente"}
                    {task.assignedToName && ` · ${task.assignedToName}`}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`mt-2 ${PRIORITY_VARIANT[task.priority]}`}
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
              {columnTasks.length === 0 && (
                <p className="px-1 text-xs text-muted-foreground">
                  Arraste tarefas para aqui.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
