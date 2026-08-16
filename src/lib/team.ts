import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function getWorkspaceMembers() {
  const { orgId } = await auth();
  if (!orgId) return [];

  const client = await clerkClient();
  const list = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  return list.data
    .map((m) => ({
      id: m.publicUserData?.userId ?? "",
      name:
        [m.publicUserData?.firstName, m.publicUserData?.lastName]
          .filter(Boolean)
          .join(" ") ||
        m.publicUserData?.identifier ||
        "Utilizador",
    }))
    .filter((m) => m.id);
}

/**
 * Garante que este utilizador (identificado pelo Clerk) tem uma linha em
 * `users` antes de o atribuirmos a um trabalho/tarefa — sem isto, a
 * referência estrangeira falhava para quem ainda não fez login.
 */
export async function ensureUserSynced(userId: string) {
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  await db
    .insert(users)
    .values({
      id: userId,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
      name: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        name: clerkUser.fullName,
        imageUrl: clerkUser.imageUrl,
      },
    });
}
