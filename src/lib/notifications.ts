import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { notifications, workspaceMembers } from "@/db/schema";

type NotificationInput = {
  type: string;
  title: string;
  body?: string;
  href?: string;
};

/** Notifica um utilizador específico (ex: foi-lhe atribuída uma tarefa). */
export async function notifyUser(
  workspaceId: string,
  userId: string,
  input: NotificationInput
) {
  const [member] = await db
    .select({ notificationsEnabled: workspaceMembers.notificationsEnabled })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      )
    );

  if (member && !member.notificationsEnabled) return;

  await db.insert(notifications).values({
    workspaceId,
    userId,
    type: input.type,
    title: input.title,
    body: input.body,
    href: input.href,
  });
}

/** Notifica todos os membros do workspace com notificações ativas. */
export async function notifyWorkspace(
  workspaceId: string,
  input: NotificationInput
) {
  const members = await db
    .select({ userId: workspaceMembers.userId })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.notificationsEnabled, true)
      )
    );

  if (members.length === 0) return;

  await db.insert(notifications).values(
    members.map((m) => ({
      workspaceId,
      userId: m.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      href: input.href,
    }))
  );
}
