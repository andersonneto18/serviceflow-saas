import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import {
  clients,
  invoices,
  jobMaterials,
  jobNotes,
  jobTasks,
  jobs,
  services,
  users,
} from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { JobStatusSelect } from "../job-status-select";
import { MaterialList } from "./material-list";
import { NoteList } from "./note-list";
import { TaskList } from "./task-list";

const STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  em_execucao: "Em execução",
  em_pausa: "Em pausa",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getCurrentWorkspace();
  if (!workspace) notFound();

  const [job] = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      status: jobs.status,
      location: jobs.location,
      scheduledAt: jobs.scheduledAt,
      value: jobs.value,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
      clientName: clients.name,
      clientPhone: clients.phone,
      serviceName: services.name,
      assignedToName: users.name,
    })
    .from(jobs)
    .leftJoin(clients, eq(jobs.clientId, clients.id))
    .leftJoin(services, eq(jobs.serviceId, services.id))
    .leftJoin(users, eq(jobs.assignedToUserId, users.id))
    .where(eq(jobs.id, id));

  if (!job) notFound();

  const [tasks, materials, notes, [invoice]] = await Promise.all([
    db.select().from(jobTasks).where(eq(jobTasks.jobId, id)).orderBy(asc(jobTasks.position)),
    db.select().from(jobMaterials).where(eq(jobMaterials.jobId, id)),
    db.select().from(jobNotes).where(eq(jobNotes.jobId, id)).orderBy(asc(jobNotes.createdAt)),
    db.select().from(invoices).where(eq(invoices.jobId, id)),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{job.title}</h1>
          <p className="text-sm text-muted-foreground">
            {job.clientName ?? "—"}
            {job.location && ` · ${job.location}`}
          </p>
        </div>
        <JobStatusSelect jobId={job.id} status={job.status} />
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Cliente</p>
                <p className="text-sm">{job.clientName ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Telefone</p>
                <p className="text-sm">{job.clientPhone ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Serviço</p>
                <p className="text-sm">{job.serviceName ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Responsável</p>
                <p className="text-sm">{job.assignedToName ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Data</p>
                <p className="text-sm">
                  {job.scheduledAt
                    ? new Date(job.scheduledAt).toLocaleString("pt-PT", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Localização</p>
                <p className="text-sm">{job.location ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Valor</p>
                <p className="font-mono text-sm tabular-nums">
                  {job.value
                    ? Number(job.value).toLocaleString("pt-PT", {
                        style: "currency",
                        currency: "EUR",
                      })
                    : "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardContent>
              <TaskList jobId={job.id} tasks={tasks} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardContent>
              <MaterialList jobId={job.id} materials={materials} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardContent>
              <NoteList jobId={job.id} notes={notes} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardContent>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 border-b py-2.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-sm">Criado</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(job.createdAt).toLocaleDateString("pt-PT")}
                  </span>
                </div>
                <div className="flex items-center gap-3 border-b py-2.5 last:border-b-0">
                  <span className="size-2 rounded-full bg-primary" />
                  <span className="text-sm">
                    Estado atual: <Badge variant="secondary">{STATUS_LABEL[job.status]}</Badge>
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(job.updatedAt).toLocaleDateString("pt-PT")}
                  </span>
                </div>
                {invoice && (
                  <div className="flex items-center gap-3 border-b py-2.5 last:border-b-0">
                    <span
                      className={`size-2 rounded-full ${
                        invoice.status === "paga" ? "bg-emerald-500" : "bg-muted-foreground"
                      }`}
                    />
                    <span className="text-sm">
                      Fatura #{invoice.number} —{" "}
                      {invoice.status === "paga" ? "Paga" : "Pendente"}
                    </span>
                    {invoice.paidAt && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(invoice.paidAt).toLocaleDateString("pt-PT")}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Timeline simplificada — mostra o estado atual, não o histórico
                completo de todas as mudanças de estado.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
