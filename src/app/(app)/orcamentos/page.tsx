import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";

import { db } from "@/db";
import { clients, quotes } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CopyLinkButton } from "./copy-link-button";

const STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  enviado: "Enviado",
  aceite: "Aceite",
  rejeitado: "Rejeitado",
  alteracao_pedida: "Alteração pedida",
};

const STATUS_VARIANT: Record<string, string> = {
  rascunho: "bg-muted text-muted-foreground",
  enviado: "bg-primary/10 text-primary",
  aceite: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejeitado: "bg-destructive/10 text-destructive",
  alteracao_pedida: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export default async function OrcamentosPage() {
  const workspace = await getCurrentWorkspace();

  const rows = workspace
    ? await db
        .select({
          id: quotes.id,
          status: quotes.status,
          total: quotes.total,
          publicToken: quotes.publicToken,
          createdAt: quotes.createdAt,
          clientName: clients.name,
        })
        .from(quotes)
        .leftJoin(clients, eq(quotes.clientId, clients.id))
        .where(eq(quotes.workspaceId, workspace.id))
        .orderBy(desc(quotes.createdAt))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Orçamentos</h1>
        <Button size="sm" render={<Link href="/orcamentos/novo" />}>
          <Plus />
          Novo orçamento
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há orçamentos</p>
          <p className="text-sm text-muted-foreground">
            Clique em &ldquo;Novo orçamento&rdquo; para criar o primeiro.
          </p>
        </div>
      ) : (
        <div className="flex flex-col rounded-lg border">
          {rows.map((quote) => (
            <div
              key={quote.id}
              className="flex items-center gap-3 border-b p-4 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {quote.clientName ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(quote.createdAt).toLocaleDateString("pt-PT")}
                </p>
              </div>
              <span className="font-mono text-sm tabular-nums">
                {Number(quote.total).toLocaleString("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
              <Badge
                variant="secondary"
                className={STATUS_VARIANT[quote.status]}
              >
                {STATUS_LABEL[quote.status]}
              </Badge>
              {quote.status !== "rascunho" && (
                <CopyLinkButton token={quote.publicToken} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
