import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { services } from "./services";
import { users } from "./users";
import { workspaces } from "./workspaces";

// Estados definidos na secção 4.3 da documentação.
export const jobStatus = pgEnum("job_status", [
  "rascunho",
  "agendado",
  "em_execucao",
  "em_pausa",
  "concluido",
  "cancelado",
]);

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").references(() => services.id, {
    onDelete: "set null",
  }),
  assignedToUserId: text("assigned_to_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  status: jobStatus("status").notNull().default("rascunho"),
  location: text("location"),
  scheduledAt: timestamp("scheduled_at"),
  value: numeric("value", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// O checklist simples dentro de um trabalho (ex: "Contactar cliente",
// "Preparar materiais"...). Não confundir com a funcionalidade "Tarefas"
// do Passo 42 — essa é um quadro Kanban à parte, mais complexo.
export const jobTasks = pgTable("job_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  done: boolean("done").notNull().default(false),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const jobNotes = pgTable("job_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  authorUserId: text("author_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Só guardamos o link do ficheiro (Cloudflare R2) — nunca a foto em si
// na base de dados (secção 5.5 da documentação).
export const jobPhotos = pgTable("job_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  type: text("type"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
