import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { clients, jobs, services } from "@/db/schema";
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

import { NewJobDialog } from "./new-job-dialog";

const STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  em_execucao: "Em execução",
  em_pausa: "Em pausa",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const STATUS_VARIANT: Record<string, string> = {
  rascunho: "bg-muted text-muted-foreground",
  agendado: "bg-primary/10 text-primary",
  em_execucao: "bg-primary/10 text-primary",
  em_pausa: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  concluido: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cancelado: "bg-destructive/10 text-destructive",
};

export default async function TrabalhosPage() {
  const workspace = await getCurrentWorkspace();

  const [rows, clientRows, serviceRows] = workspace
    ? await Promise.all([
        db
          .select({
            id: jobs.id,
            title: jobs.title,
            status: jobs.status,
            scheduledAt: jobs.scheduledAt,
            value: jobs.value,
            clientName: clients.name,
            serviceName: services.name,
          })
          .from(jobs)
          .leftJoin(clients, eq(jobs.clientId, clients.id))
          .leftJoin(services, eq(jobs.serviceId, services.id))
          .where(eq(jobs.workspaceId, workspace.id))
          .orderBy(desc(jobs.createdAt)),
        db
          .select({ id: clients.id, name: clients.name })
          .from(clients)
          .where(eq(clients.workspaceId, workspace.id)),
        db
          .select({ id: services.id, name: services.name })
          .from(services)
          .where(eq(services.workspaceId, workspace.id)),
      ])
    : [[], [], []];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Trabalhos</h1>
        <NewJobDialog clients={clientRows} services={serviceRows} />
      </div>

      {clientRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há clientes</p>
          <p className="text-sm text-muted-foreground">
            Crie primeiro um cliente em Clientes para poder criar trabalhos.
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há trabalhos</p>
          <p className="text-sm text-muted-foreground">
            Clique em &ldquo;Novo trabalho&rdquo; para criar o primeiro.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Trabalho</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    {job.clientName ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.serviceName ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.scheduledAt
                      ? new Date(job.scheduledAt).toLocaleString("pt-PT", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={STATUS_VARIANT[job.status]}
                    >
                      {STATUS_LABEL[job.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {job.value
                      ? Number(job.value).toLocaleString("pt-PT", {
                          style: "currency",
                          currency: "EUR",
                        })
                      : "—"}
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
