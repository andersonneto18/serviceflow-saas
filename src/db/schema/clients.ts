import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { workspaces } from "./workspaces";

// Estados definidos na documentação (secção 4.4 — Clientes / filtros).
export const clientStatus = pgEnum("client_status", [
  "ativo",
  "potencial",
  "inativo",
]);

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Todas as tabelas de dados do negócio têm workspaceId — é o que garante
  // o isolamento multi-tenant: uma query sem filtrar por isto está errada.
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  status: clientStatus("status").notNull().default("potencial"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const clientAddresses = pgTable("client_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  label: text("label"),
  street: text("street").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code"),
  country: text("country").notNull().default("PT"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Documentos do cliente (secção 4.4 da documentação). Só guardamos o link
// (Cloudflare R2) — o ficheiro em si nunca fica na base de dados.
export const clientDocuments = pgTable("client_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
