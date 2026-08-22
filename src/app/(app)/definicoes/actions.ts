"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { workspaceMembers } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function getNotificationsEnabled() {
  const { userId } = await auth();
  const workspace = await getCurrentWorkspace();
  if (!userId || !workspace) return true;

  const [member] = await db
    .select({ notificationsEnabled: workspaceMembers.notificationsEnabled })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspace.id),
        eq(workspaceMembers.userId, userId)
      )
    );

  return member?.notificationsEnabled ?? true;
}

export async function setNotificationsEnabled(enabled: boolean) {
  const { userId } = await auth();
  const workspace = await getCurrentWorkspace();
  if (!userId || !workspace) return;

  await db
    .update(workspaceMembers)
    .set({ notificationsEnabled: enabled })
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspace.id),
        eq(workspaceMembers.userId, userId)
      )
    );

  revalidatePath("/definicoes");
}
