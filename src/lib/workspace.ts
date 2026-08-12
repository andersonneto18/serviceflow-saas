import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, workspaceMembers, workspaces } from "@/db/schema";

function mapClerkRole(
  orgRole?: string | null
): "administrador" | "gestor" | "profissional" | "visualizacao" {
  if (orgRole === "org:admin") return "administrador";
  return "profissional";
}

/**
 * Devolve o workspace atual (ligado à Organização ativa no Clerk),
 * criando-o na nossa base de dados na primeira vez que for preciso
 * (sincronização "on demand" — mais tarde substituímos/complementamos
 * isto com webhooks do Clerk, para o registo acontecer sempre, mesmo
 * sem o utilizador abrir a app).
 *
 * TODA a query a dados do negócio (clientes, trabalhos, orçamentos...)
 * deve passar por aqui para saber a que workspaceId filtrar — nunca
 * uma query "solta" sem este filtro.
 */
export async function getCurrentWorkspace() {
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !orgId) return null;

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

  let [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.clerkOrgId, orgId));

  if (!workspace) {
    const clerkOrg = await client.organizations.getOrganization({
      organizationId: orgId,
    });
    [workspace] = await db
      .insert(workspaces)
      .values({
        clerkOrgId: orgId,
        name: clerkOrg.name,
        slug: clerkOrg.slug ?? orgId,
      })
      .returning();
  }

  await db
    .insert(workspaceMembers)
    .values({
      workspaceId: workspace.id,
      userId,
      role: mapClerkRole(orgRole),
    })
    .onConflictDoNothing({
      target: [workspaceMembers.workspaceId, workspaceMembers.userId],
    });

  return workspace;
}
