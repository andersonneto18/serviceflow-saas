import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { workspaces } from "./workspaces";

// Como o preço do serviço se calcula (secção 4.7 e 9 da documentação:
// "€80/h", "€50" fixo, ou "Preço variável" a definir em cada orçamento).
export const servicePriceType = pgEnum("service_price_type", [
  "fixo",
  "hora",
  "variavel",
]);

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  priceType: servicePriceType("price_type").notNull().default("fixo"),
  // numeric guarda o número como string internamente — evita erros de
  // arredondamento em dinheiro, que o tipo `number` do JS tem (ponto flutuante).
  price: numeric("price", { precision: 10, scale: 2 }),
  durationMinutes: integer("duration_minutes"),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  unit: text("unit"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});