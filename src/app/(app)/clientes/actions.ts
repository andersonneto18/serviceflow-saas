"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

import { clientFormSchema, type ClientFormValues } from "./schema";

export async function createClient(values: ClientFormValues) {
  const parsed = clientFormSchema.parse(values);

  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  await db.insert(clients).values({
    workspaceId: workspace.id,
    name: parsed.name,
    company: parsed.company || null,
    email: parsed.email || null,
    phone: parsed.phone || null,
    status: parsed.status,
    notes: parsed.notes || null,
  });

  revalidatePath("/clientes");
}
