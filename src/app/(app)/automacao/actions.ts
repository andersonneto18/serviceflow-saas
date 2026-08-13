"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { automations } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function toggleAutomation(key: string, active: boolean) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  await db
    .insert(automations)
    .values({ workspaceId: workspace.id, key, active })
    .onConflictDoUpdate({
      target: [automations.workspaceId, automations.key],
      set: { active, updatedAt: new Date() },
    });

  revalidatePath("/automacao");
}
