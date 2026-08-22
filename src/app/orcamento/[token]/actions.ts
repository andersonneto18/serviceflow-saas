"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { clients, jobs, quotes } from "@/db/schema";
import { AUTOMATION_KEYS, isAutomationActive } from "@/lib/automations";
import { notifyWorkspace } from "@/lib/notifications";

export async function respondToQuote(
  token: string,
  decision: "aceite" | "rejeitado"
) {
  const [quote] = await db
    .select()
    .from(quotes)
    .where(eq(quotes.publicToken, token));

  if (!quote) throw new Error("Orçamento não encontrado.");
  if (quote.status !== "enviado") return;

  if (decision === "aceite") {
    // Automação (secção 7/18 da documentação): orçamento aprovado -> cria
    // trabalho. Configurável em /automacao — por defeito está ligada.
    const shouldCreateJob = await isAutomationActive(
      quote.workspaceId,
      AUTOMATION_KEYS.QUOTE_ACCEPTED_CREATES_JOB
    );

    let jobId: string | null = null;
    if (shouldCreateJob) {
      const [job] = await db
        .insert(jobs)
        .values({
          workspaceId: quote.workspaceId,
          clientId: quote.clientId,
          title: "Trabalho criado a partir do orçamento",
          status: "agendado",
          value: quote.total,
        })
        .returning();
      jobId = job.id;
    }

    await db
      .update(quotes)
      .set({ status: "aceite", respondedAt: new Date(), jobId })
      .where(eq(quotes.id, quote.id));

    const [client] = await db
      .select({ name: clients.name })
      .from(clients)
      .where(eq(clients.id, quote.clientId));

    await notifyWorkspace(quote.workspaceId, {
      type: "orcamento_aceite",
      title: "Orçamento aceite",
      body: client?.name,
      href: jobId ? `/trabalhos/${jobId}` : "/orcamentos",
    });
  } else {
    await db
      .update(quotes)
      .set({ status: "rejeitado", respondedAt: new Date() })
      .where(eq(quotes.id, quote.id));
  }

  revalidatePath(`/orcamento/${token}`);
}
