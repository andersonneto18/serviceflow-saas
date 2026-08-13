import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { workspaces } from "./workspaces";

// Cada linha é uma regra (secção 18 da documentação). Guardamos só se está
// ativa — a ação em si está fixa no código (não é um construtor de regras
// livre, isso seria um produto à parte).
export const automations = pgTable(
  "automations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("automations_workspace_key_idx").on(
      table.workspaceId,
      table.key
    ),
  ]
);
