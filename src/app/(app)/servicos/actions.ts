"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { services } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

import { serviceFormSchema, type ServiceFormValues } from "./schema";

export async function createService(values: ServiceFormValues) {
  const parsed = serviceFormSchema.parse(values);

  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  await db.insert(services).values({
    workspaceId: workspace.id,
    name: parsed.name,
    description: parsed.description || null,
    category: parsed.category || null,
    priceType: parsed.priceType,
    price: parsed.price || null,
    durationMinutes: parsed.durationMinutes
      ? Number(parsed.durationMinutes)
      : null,
  });

  revalidatePath("/servicos");
}
