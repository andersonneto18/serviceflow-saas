import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { jobs } from "./jobs";
import { users } from "./users";
import { workspaces } from "./workspaces";

// Estados e prioridades definidos na secção 4.8 da documentação (Tarefas).
export const taskStatus = pgEnum("task_status", [
  "todo",
  "in_progress",
  "done",
]);

export const taskPriority = pgEnum("task_priority", [
  "baixa",
  "normal",
  "alta",
  "urgente",
]);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatus("status").notNull().default("todo"),
  priority: taskPriority("priority").notNull().default("normal"),
  dueDate: timestamp("due_date"),
  assignedToUserId: text("assigned_to_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  clientId: uuid("client_id").references(() => clients.id, {
    onDelete: "set null",
  }),
  jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
