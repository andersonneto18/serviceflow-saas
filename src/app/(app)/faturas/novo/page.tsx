import { eq } from "drizzle-orm";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

import { InvoiceForm } from "./invoice-form";

export default async function NovaFaturaPage() {
  const workspace = await getCurrentWorkspace();

  const clientRows = workspace
    ? await db
        .select({ id: clients.id, name: clients.name })
        .from(clients)
        .where(eq(clients.workspaceId, workspace.id))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Nova fatura</h1>
        <p className="text-sm text-muted-foreground">
          Adicione os itens e ajuste o IVA, e guarde ou envie.
        </p>
      </div>

      {clientRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há clientes</p>
          <p className="text-sm text-muted-foreground">
            Crie primeiro um cliente em Clientes.
          </p>
        </div>
      ) : (
        <InvoiceForm clients={clientRows} />
      )}
    </div>
  );
}
