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

// Estados definidos na secção 4.5 da documentação.
export const quoteStatus = pgEnum("quote_status", [
  "rascunho",
  "enviado",
  "aceite",
  "rejeitado",
  "alteracao_pedida",
]);

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  // Um orçamento pode existir antes de haver trabalho — só passa a ter
  // jobId quando for aceite e o trabalho for criado automaticamente
  // (secção 7 da documentação, automação do Passo 49).
  jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
  status: quoteStatus("status").notNull().default("rascunho"),
  // Token aleatório usado no link público que o cliente recebe por email —
  // permite ver e responder ao orçamento sem precisar de login (Passo 47).
  publicToken: text("public_token").notNull().unique(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 10, scale: 2 }),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  sentAt: timestamp("sent_at"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const quoteItems = pgTable("quote_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 })
    .notNull()
    .default("1"),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});