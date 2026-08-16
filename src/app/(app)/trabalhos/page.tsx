import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { clients, jobs, services, users } from "@/db/schema";
import { getWorkspaceMembers } from "@/lib/team";
import { getCurrentWorkspace } from "@/lib/workspace";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { JobStatusSelect } from "./job-status-select";
import { NewJobDialog } from "./new-job-dialog";

export default async function TrabalhosPage() {
  const workspace = await getCurrentWorkspace();

  const [rows, clientRows, serviceRows, memberRows] = workspace
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
            assignedToName: users.name,
          })
          .from(jobs)
          .leftJoin(clients, eq(jobs.clientId, clients.id))
          .leftJoin(services, eq(jobs.serviceId, services.id))
          .leftJoin(users, eq(jobs.assignedToUserId, users.id))
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
        getWorkspaceMembers(),
      ])
    : [[], [], [], []];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Trabalhos</h1>
        <NewJobDialog
          clients={clientRows}
          services={serviceRows}
          members={memberRows}
        />
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
                <TableHead>Responsável</TableHead>
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
                    <Link
                      href={`/trabalhos/${job.id}`}
                      className="hover:text-foreground hover:underline"
                    >
                      {job.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.serviceName ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.assignedToName ?? "—"}
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
                    <JobStatusSelect jobId={job.id} status={job.status} />
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
