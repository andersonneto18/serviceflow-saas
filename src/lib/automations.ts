import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { automations } from "@/db/schema";

export const AUTOMATION_KEYS = {
  QUOTE_ACCEPTED_CREATES_JOB: "orcamento_aceite_cria_trabalho",
  JOB_COMPLETED_CREATES_INVOICE: "trabalho_concluido_cria_fatura",
} as const;

export const AUTOMATIONS = [
  {
    key: AUTOMATION_KEYS.QUOTE_ACCEPTED_CREATES_JOB,
    when: "Orçamento aceite",
    then: "Criar trabalho automaticamente",
  },
  {
    key: AUTOMATION_KEYS.JOB_COMPLETED_CREATES_INVOICE,
    when: "Trabalho marcado como concluído",
    then: "Criar fatura automaticamente com o valor do trabalho",
  },
] as const;

/**
 * Se ainda não existir uma linha para esta regra, considera-se ATIVA por
 * defeito — é o comportamento que a app já tinha antes de existir este
 * interruptor, por isso "sem configuração" tem de significar "ligado".
 */
export async function isAutomationActive(workspaceId: string, key: string) {
  const [row] = await db
    .select({ active: automations.active })
    .from(automations)
    .where(and(eq(automations.workspaceId, workspaceId), eq(automations.key, key)));

  return row ? row.active : true;
}
