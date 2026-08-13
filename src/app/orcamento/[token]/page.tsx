import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { clients, quoteItems, quotes, workspaces } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { RespondButtons } from "./respond-buttons";

const STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  enviado: "Aguarda resposta",
  aceite: "Aceite",
  rejeitado: "Rejeitado",
  alteracao_pedida: "Alteração pedida",
};

function money(value: string | number) {
  return Number(value).toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
  });
}

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const [quote] = await db
    .select({
      id: quotes.id,
      status: quotes.status,
      subtotal: quotes.subtotal,
      discount: quotes.discount,
      taxAmount: quotes.taxAmount,
      total: quotes.total,
      clientName: clients.name,
      workspaceName: workspaces.name,
    })
    .from(quotes)
    .leftJoin(clients, eq(quotes.clientId, clients.id))
    .leftJoin(workspaces, eq(quotes.workspaceId, workspaces.id))
    .where(eq(quotes.publicToken, token));

  if (!quote || quote.status === "rascunho") {
    notFound();
  }

  const items = await db
    .select()
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, quote.id));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 px-4 py-16">
      <div>
        <p className="text-sm text-muted-foreground">{quote.workspaceName}</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Orçamento para {quote.clientName}
        </h1>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b py-2 text-sm last:border-b-0"
            >
              <span>
                {item.description}
                <span className="text-muted-foreground">
                  {" "}
                  × {item.quantity}
                </span>
              </span>
              <span className="font-mono tabular-nums">
                {money(Number(item.quantity) * Number(item.unitPrice))}
              </span>
            </div>
          ))}

          <div className="mt-2 flex flex-col gap-1 border-t pt-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">
                {money(quote.subtotal)}
              </span>
            </div>
            {quote.discount && Number(quote.discount) > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Desconto</span>
                <span className="font-mono tabular-nums">
                  -{money(quote.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>IVA</span>
              <span className="font-mono tabular-nums">
                {money(quote.taxAmount)}
              </span>
            </div>
            <div className="mt-1 flex justify-between border-t pt-2 text-lg font-semibold">
              <span>Total</span>
              <span className="font-mono tabular-nums">
                {money(quote.total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {quote.status === "enviado" ? (
        <RespondButtons token={token} />
      ) : (
        <Badge
          variant="secondary"
          className="w-fit bg-muted text-muted-foreground"
        >
          {STATUS_LABEL[quote.status]}
        </Badge>
      )}
    </div>
  );
}
