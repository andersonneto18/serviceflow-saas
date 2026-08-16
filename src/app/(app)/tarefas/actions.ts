"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { tasks } from "@/db/schema";
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

  await db.insert(tasks).values({
    workspaceId: workspace.id,
    title: parsed.title,
    description: parsed.description || null,
    priority: parsed.priority,
    dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
    clientId: parsed.clientId || null,
    assignedToUserId: parsed.assignedToUserId || null,
  });

  revalidatePath("/tarefas");
}

export async function toggleTaskDone(taskId: string, done: boolean) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  await db
    .update(tasks)
    .set({ status: done ? "done" : "todo", updatedAt: new Date() })
    .where(eq(tasks.id, taskId));

  revalidatePath("/tarefas");
}
