import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Download, Plus } from "lucide-react";

import { db } from "@/db";
import { clients, invoices } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MarkPaidButton } from "./mark-paid-button";

function isOverdue(status: string, dueDate: Date | null) {
  return status === "enviada" && !!dueDate && dueDate.getTime() < Date.now();
}

function statusInfo(status: string, dueDate: Date | null) {
  if (isOverdue(status, dueDate)) {
    return {
      label: "Atrasada",
      className: "bg-destructive/10 text-destructive",
    };
  }
  const map: Record<string, { label: string; className: string }> = {
    rascunho: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
    enviada: { label: "Enviada", className: "bg-primary/10 text-primary" },
    paga: {
      label: "Paga",
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    cancelada: { label: "Cancelada", className: "bg-muted text-muted-foreground" },
  };
  return map[status];
}

export default async function FaturasPage() {
  const workspace = await getCurrentWorkspace();

  const rows = workspace
    ? await db
        .select({
          id: invoices.id,
          number: invoices.number,
          status: invoices.status,
          dueDate: invoices.dueDate,
          total: invoices.total,
          createdAt: invoices.createdAt,
          clientName: clients.name,
        })
        .from(invoices)
        .leftJoin(clients, eq(invoices.clientId, clients.id))
        .where(eq(invoices.workspaceId, workspace.id))
        .orderBy(desc(invoices.createdAt))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Faturas</h1>
        <Button size="sm" render={<Link href="/faturas/novo" />}>
          <Plus />
          Nova fatura
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há faturas</p>
          <p className="text-sm text-muted-foreground">
            Clique em &ldquo;Nova fatura&rdquo; para criar a primeira.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((invoice) => {
                const info = statusInfo(invoice.status, invoice.dueDate);
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">
                      #{invoice.number}
                    </TableCell>
                    <TableCell className="font-medium">
                      {invoice.clientName ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {invoice.dueDate
                        ? new Date(invoice.dueDate).toLocaleDateString("pt-PT")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={info.className}>
                        {info.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {Number(invoice.total).toLocaleString("pt-PT", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          render={<Link href={`/faturas/${invoice.id}/pdf`} />}
                        >
                          <Download />
                          PDF
                        </Button>
                        {invoice.status !== "paga" &&
                          invoice.status !== "cancelada" && (
                            <MarkPaidButton invoiceId={invoice.id} />
                          )}
                      </div>
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
