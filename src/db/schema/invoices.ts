import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { jobs } from "./jobs";
import { workspaces } from "./workspaces";

// "atrasada" não é guardado — calcula-se (enviada + dueDate já passou),
// para nunca ficar desatualizado sem um processo a correr no fundo.
export const invoiceStatus = pgEnum("invoice_status", [
  "rascunho",
  "enviada",
  "paga",
  "cancelada",
]);

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Número sequencial legível (#1, #2...) — gerado pelo próprio Postgres.
  number: integer("number").generatedAlwaysAsIdentity(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
  status: invoiceStatus("status").notNull().default("rascunho"),
  dueDate: timestamp("due_date"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 })
    .notNull()
    .default("1"),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  position: integer("position").notNull().default(0),
});
