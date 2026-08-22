import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { NewClientDialog } from "./new-client-dialog";

const STATUS_LABEL: Record<string, string> = {
  ativo: "Ativo",
  potencial: "Potencial",
  inativo: "Inativo",
};

const STATUS_VARIANT: Record<string, string> = {
  ativo: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  potencial: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  inativo: "bg-muted text-muted-foreground",
};

export default async function ClientesPage() {
  const workspace = await getCurrentWorkspace();

  const rows = workspace
    ? await db
        .select()
        .from(clients)
        .where(eq(clients.workspaceId, workspace.id))
        .orderBy(desc(clients.createdAt))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Clientes</h1>
        <NewClientDialog />
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há clientes</p>
          <p className="text-sm text-muted-foreground">
            Clique em &ldquo;Novo cliente&rdquo; para adicionar o primeiro.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/clientes/${client.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.company || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.email || client.phone || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={STATUS_VARIANT[client.status]}
                    >
                      {STATUS_LABEL[client.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
