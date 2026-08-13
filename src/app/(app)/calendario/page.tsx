import { and, asc, eq, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { clients, jobs } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";

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

function dayLabel(date: Date) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Hoje";
  if (isSameDay(date, tomorrow)) return "Amanhã";
  return date.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export default async function CalendarioPage() {
  const workspace = await getCurrentWorkspace();

  const rows = workspace
    ? await db
        .select({
          id: jobs.id,
          title: jobs.title,
          status: jobs.status,
          scheduledAt: jobs.scheduledAt,
          location: jobs.location,
          clientName: clients.name,
        })
        .from(jobs)
        .leftJoin(clients, eq(jobs.clientId, clients.id))
        .where(
          and(eq(jobs.workspaceId, workspace.id), isNotNull(jobs.scheduledAt))
        )
        .orderBy(asc(jobs.scheduledAt))
    : [];

  const groups = new Map<string, typeof rows>();
  for (const row of rows) {
    const key = new Date(row.scheduledAt!).toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Calendário</h1>
        <p className="text-sm text-muted-foreground">
          Trabalhos agendados, por ordem cronológica.
        </p>
      </div>

      {groups.size === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há nada agendado</p>
          <p className="text-sm text-muted-foreground">
            Marque uma data/hora ao criar um trabalho, em Trabalhos.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Array.from(groups.entries()).map(([key, dayJobs]) => (
            <div key={key} className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold capitalize">
                {dayLabel(new Date(key))}
              </h2>
              <div className="rounded-lg border">
                {dayJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center gap-3 border-b p-4 last:border-b-0"
                  >
                    <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                      {new Date(job.scheduledAt!).toLocaleTimeString(
                        "pt-PT",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {job.clientName ?? "—"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {job.title}
                        {job.location && ` · ${job.location}`}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={STATUS_VARIANT[job.status]}
                    >
                      {STATUS_LABEL[job.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
