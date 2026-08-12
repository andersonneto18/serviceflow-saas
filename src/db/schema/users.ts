import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// O id é o mesmo ID que o Clerk usa para este utilizador — não geramos
// o nosso próprio, para nunca haver ambiguidade sobre "quem é quem"
// entre o Clerk (autenticação) e a nossa base de dados (dados do negócio).
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
