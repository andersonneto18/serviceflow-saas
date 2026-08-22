"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { invoiceItems, invoices, jobs } from "@/db/schema";
import { AUTOMATION_KEYS, isAutomationActive } from "@/lib/automations";
import { notifyUser } from "@/lib/notifications";
import { ensureUserSynced } from "@/lib/team";
import { getCurrentWorkspace } from "@/lib/workspace";

import { jobFormSchema, type JobFormValues } from "./schema";

export async function createJob(values: JobFormValues) {
  const parsed = jobFormSchema.parse(values);

  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  if (parsed.assignedToUserId) {
    await ensureUserSynced(parsed.assignedToUserId);
  }

  const [job] = await db
    .insert(jobs)
    .values({
      workspaceId: workspace.id,
      clientId: parsed.clientId,
      serviceId: parsed.serviceId || null,
      assignedToUserId: parsed.assignedToUserId || null,
      title: parsed.title,
      status: parsed.status,
      location: parsed.location || null,
      scheduledAt: parsed.scheduledAt ? new Date(parsed.scheduledAt) : null,
      value: parsed.value || null,
    })
    .returning();

  if (parsed.assignedToUserId) {
    await notifyUser(workspace.id, parsed.assignedToUserId, {
      type: "trabalho_atribuido",
      title: "Novo trabalho atribuído",
      body: job.title,
      href: `/trabalhos/${job.id}`,
    });
  }

  revalidatePath("/trabalhos");
}

export async function updateJobStatus(
  jobId: string,
  status: JobFormValues["status"]
) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  const [job] = await db
    .update(jobs)
    .set({ status, updatedAt: new Date() })
    .where(eq(jobs.id, jobId))
    .returning();

  if (status === "concluido") {
    // Automação (secção 18 da documentação): trabalho concluído -> cria
    // fatura. Configurável em /automacao — por defeito está ligada.
    const shouldCreateInvoice = await isAutomationActive(
      workspace.id,
      AUTOMATION_KEYS.JOB_COMPLETED_CREATES_INVOICE
    );

    if (shouldCreateInvoice && job.value) {
      const [invoice] = await db
        .insert(invoices)
        .values({
          workspaceId: workspace.id,
          clientId: job.clientId,
          jobId: job.id,
          status: "enviada",
          subtotal: job.value,
          taxAmount: "0.00",
          total: job.value,
        })
        .returning();

      await db.insert(invoiceItems).values({
        invoiceId: invoice.id,
        description: job.title,
        quantity: "1",
        unitPrice: job.value,
        position: 0,
      });

      revalidatePath("/faturas");
      revalidatePath("/pagamentos");
    }
  }

  revalidatePath("/trabalhos");
}
