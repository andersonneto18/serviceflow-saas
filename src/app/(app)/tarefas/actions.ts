"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { notifyUser } from "@/lib/notifications";
import { ensureUserSynced } from "@/lib/team";
import { getCurrentWorkspace } from "@/lib/workspace";

import { taskFormSchema, type TaskFormValues } from "./schema";

export async function createTask(values: TaskFormValues) {
  const parsed = taskFormSchema.parse(values);

  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  if (parsed.assignedToUserId) {
    await ensureUserSynced(parsed.assignedToUserId);
  }

  const [task] = await db
    .insert(tasks)
    .values({
      workspaceId: workspace.id,
      title: parsed.title,
      description: parsed.description || null,
      priority: parsed.priority,
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
      clientId: parsed.clientId || null,
      assignedToUserId: parsed.assignedToUserId || null,
    })
    .returning();

  if (parsed.assignedToUserId) {
    await notifyUser(workspace.id, parsed.assignedToUserId, {
      type: "tarefa_atribuida",
      title: "Nova tarefa atribuída",
      body: task.title,
      href: "/tarefas",
    });
  }

  revalidatePath("/tarefas");
}

export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "in_progress" | "done"
) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  const [task] = await db
    .update(tasks)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(tasks.id, taskId), eq(tasks.workspaceId, workspace.id)))
    .returning();

  if (!task) {
    throw new Error("Tarefa não encontrada neste workspace.");
  }

  revalidatePath("/tarefas");
}

export async function toggleTaskDone(taskId: string, done: boolean) {
  await updateTaskStatus(taskId, done ? "done" : "todo");
}
