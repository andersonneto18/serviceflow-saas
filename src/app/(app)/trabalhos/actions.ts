"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { jobs } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

import { jobFormSchema, type JobFormValues } from "./schema";

export async function createJob(values: JobFormValues) {
  const parsed = jobFormSchema.parse(values);

  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  await db.insert(jobs).values({
    workspaceId: workspace.id,
    clientId: parsed.clientId,
    serviceId: parsed.serviceId || null,
    title: parsed.title,
    status: parsed.status,
    location: parsed.location || null,
    scheduledAt: parsed.scheduledAt ? new Date(parsed.scheduledAt) : null,
    value: parsed.value || null,
  });

  revalidatePath("/trabalhos");
}
