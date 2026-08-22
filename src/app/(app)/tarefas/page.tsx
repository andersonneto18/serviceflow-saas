import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { clients, tasks, users } from "@/db/schema";
import { getWorkspaceMembers } from "@/lib/team";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { NewTaskDialog } from "./new-task-dialog";
import { TaskBoard } from "./task-board";
import { TaskCheckbox } from "./task-checkbox";

const PRIORITY_LABEL: Record<string, string> = {
  baixa: "Baixa",
  normal: "Normal",
  alta: "Alta",
  urgente: "Urgente",
};

const PRIORITY_VARIANT: Record<string, string> = {
  baixa: "bg-muted text-muted-foreground",
  normal: "bg-primary/10 text-primary",
  alta: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  urgente: "bg-destructive/10 text-destructive",
};

export default async function TarefasPage() {
  const workspace = await getCurrentWorkspace();

  const [taskRows, clientRows, memberRows] = workspace
    ? await Promise.all([
        db
          .select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            status: tasks.status,
            priority: tasks.priority,
            dueDate: tasks.dueDate,
            clientName: clients.name,
            assignedToName: users.name,
          })
          .from(tasks)
          .leftJoin(clients, eq(tasks.clientId, clients.id))
          .leftJoin(users, eq(tasks.assignedToUserId, users.id))
          .where(eq(tasks.workspaceId, workspace.id))
          .orderBy(asc(tasks.dueDate)),
        db
          .select({ id: clients.id, name: clients.name })
          .from(clients)
          .where(eq(clients.workspaceId, workspace.id)),
        getWorkspaceMembers(),
      ])
    : [[], [], []];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Tarefas</h1>
        <NewTaskDialog clients={clientRows} members={memberRows} />
      </div>

      {taskRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há tarefas</p>
          <p className="text-sm text-muted-foreground">
            Clique em &ldquo;Nova tarefa&rdquo; para criar a primeira.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="board">Kanban</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="flex flex-col rounded-lg border">
              {taskRows.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 border-b p-4 last:border-b-0"
                >
                  <TaskCheckbox taskId={task.id} done={task.status === "done"} />
                  <div className="min-w-0 flex-1">
                    <p
                      className={
                        task.status === "done"
                          ? "truncate text-sm font-medium text-muted-foreground line-through"
                          : "truncate text-sm font-medium"
                      }
                    >
                      {task.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {task.clientName ?? "Sem cliente"}
                      {task.assignedToName && ` · ${task.assignedToName}`}
                      {task.dueDate &&
                        ` · ${new Date(task.dueDate).toLocaleDateString("pt-PT")}`}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={PRIORITY_VARIANT[task.priority]}
                  >
                    {PRIORITY_LABEL[task.priority]}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="board">
            <TaskBoard tasks={taskRows} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
