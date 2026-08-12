import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users";

// Workspace = uma empresa/profissional dentro da app (ex: "João Eletricista").
// Cada workspace corresponde a uma Organização no Clerk.
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkOrgId: text("clerk_org_id").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Os 4 cargos definidos na documentação (secção 11 — Equipa).
export const workspaceMemberRole = pgEnum("workspace_member_role", [
  "administrador",
  "gestor",
  "profissional",
  "visualizacao",
]);

// Tabela de ligação: qual utilizador pertence a qual workspace, com que cargo.
// Um utilizador pode aparecer várias vezes aqui — uma linha por workspace a que pertence.
export const workspaceMembers = pgTable("workspace_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: workspaceMemberRole("role").notNull().default("profissional"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
