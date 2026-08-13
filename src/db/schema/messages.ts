import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { users } from "./users";
import { workspaces } from "./workspaces";

// Quem enviou a mensagem (secção 14 da documentação — Inbox).
// "cliente" só vai começar a existir quando construirmos o Portal do
// Cliente (Passo 64); por agora só conseguimos enviar como "equipa".
export const messageSender = pgEnum("message_sender", [
  "cliente",
  "equipa",
  "sistema",
]);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  clientId: uuid("client_id").references(() => clients.id, {
    onDelete: "cascade",
  }),
  senderType: messageSender("sender_type").notNull().default("equipa"),
  authorUserId: text("author_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
