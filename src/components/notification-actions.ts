"use server";

import { and, desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function getNotifications() {
  const { userId } = await auth();
  const workspace = await getCurrentWorkspace();
  if (!userId || !workspace) return [];

  return db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.workspaceId, workspace.id),
        eq(notifications.userId, userId)
      )
    )
    .orderBy(desc(notifications.createdAt))
    .limit(20);
}

export async function markNotificationRead(id: string) {
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, id));
  revalidatePath("/", "layout");
}

export async function markAllNotificationsRead() {
  const { userId } = await auth();
  const workspace = await getCurrentWorkspace();
  if (!userId || !workspace) return;

  await db
    .update(notifications)
    .set({ read: true })
    .where(
      and(
        eq(notifications.workspaceId, workspace.id),
        eq(notifications.userId, userId)
      )
    );
  revalidatePath("/", "layout");
}
