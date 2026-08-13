"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function inviteMember(email: string, role: "org:admin" | "org:member") {
  const { userId, orgId, has } = await auth();
  if (!userId || !orgId) {
    throw new Error("Sem workspace ativo.");
  }
  if (!has({ role: "org:admin" })) {
    throw new Error("Sem permissão para convidar membros.");
  }

  const client = await clerkClient();
  await client.organizations.createOrganizationInvitation({
    organizationId: orgId,
    inviterUserId: userId,
    emailAddress: email,
    role,
  });

  revalidatePath("/equipas");
}
