"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { jobs, quotes } from "@/db/schema";

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
    // Automação (secção 7 da documentação): orçamento aprovado -> cria trabalho.
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

    await db
      .update(quotes)
      .set({ status: "aceite", respondedAt: new Date(), jobId: job.id })
      .where(eq(quotes.id, quote.id));
  } else {
    await db
      .update(quotes)
      .set({ status: "rejeitado", respondedAt: new Date() })
      .where(eq(quotes.id, quote.id));
  }

  revalidatePath(`/orcamento/${token}`);
}
