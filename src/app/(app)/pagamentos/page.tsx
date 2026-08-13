import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { clients, invoices } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function isOverdue(status: string, dueDate: Date | null) {
  return status === "enviada" && !!dueDate && dueDate.getTime() < Date.now();
}

const STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  enviada: "Pendente",
  paga: "Pago",
  cancelada: "Cancelada",
};

const STATUS_VARIANT: Record<string, string> = {
  rascunho: "bg-muted text-muted-foreground",
  enviada: "bg-primary/10 text-primary",
  paga: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cancelada: "bg-muted text-muted-foreground",
};

function money(value: number) {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

export default async function PagamentosPage() {
  const workspace = await getCurrentWorkspace();

  const rows = workspace
    ? await db
        .select({
          id: invoices.id,
          status: invoices.status,
          dueDate: invoices.dueDate,
          total: invoices.total,
          paidAt: invoices.paidAt,
          clientName: clients.name,
        })
        .from(invoices)
        .leftJoin(clients, eq(invoices.clientId, clients.id))
        .where(eq(invoices.workspaceId, workspace.id))
        .orderBy(desc(invoices.createdAt))
    : [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const recebidoEsteMes = rows
    .filter((r) => r.status === "paga" && r.paidAt && r.paidAt >= startOfMonth)
    .reduce((sum, r) => sum + Number(r.total), 0);

  const pendente = rows
    .filter((r) => r.status === "enviada" && !isOverdue(r.status, r.dueDate))
    .reduce((sum, r) => sum + Number(r.total), 0);

  const atrasado = rows
    .filter((r) => isOverdue(r.status, r.dueDate))
    .reduce((sum, r) => sum + Number(r.total), 0);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight">Pagamentos</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Recebido este mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {money(recebidoEsteMes)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {money(pendente)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Atrasado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums text-destructive">
              {money(atrasado)}
            </div>
          </CardContent>
        </Card>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há faturas</p>
          <p className="text-sm text-muted-foreground">
            Os pagamentos aparecem aqui assim que criar faturas.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const overdue = isOverdue(row.status, row.dueDate);
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.clientName ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {money(Number(row.total))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          overdue
                            ? "bg-destructive/10 text-destructive"
                            : STATUS_VARIANT[row.status]
                        }
                      >
                        {overdue ? "Atrasado" : STATUS_LABEL[row.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
