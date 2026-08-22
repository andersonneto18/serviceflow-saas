import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";
import { workspaces } from "./workspaces";

// Secção 15 da documentação. "type" é livre (não enum) para não precisarmos
// de migração sempre que adicionarmos um novo tipo de notificação.
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  href: text("href"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
