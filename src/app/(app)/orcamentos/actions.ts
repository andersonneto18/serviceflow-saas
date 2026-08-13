"use server";

import crypto from "node:crypto";

import { redirect } from "next/navigation";

import { db } from "@/db";
import { quoteItems, quotes } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

import { quoteFormSchema, type QuoteFormValues } from "./schema";

export async function createQuote(values: QuoteFormValues, send: boolean) {
  const parsed = quoteFormSchema.parse(values);

  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  const subtotal = parsed.items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );
  const discount = parsed.discount ? Number(parsed.discount) : 0;
  const taxRate = Number(parsed.taxRate);
  const taxAmount = (subtotal - discount) * (taxRate / 100);
  const total = subtotal - discount + taxAmount;

  const [quote] = await db
    .insert(quotes)
    .values({
      workspaceId: workspace.id,
      clientId: parsed.clientId,
      status: send ? "enviado" : "rascunho",
      publicToken: crypto.randomUUID(),
      subtotal: subtotal.toFixed(2),
      discount: discount ? discount.toFixed(2) : null,
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
      sentAt: send ? new Date() : null,
    })
    .returning();

  await db.insert(quoteItems).values(
    parsed.items.map((item, index) => ({
      quoteId: quote.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      position: index,
    }))
  );

  redirect("/orcamentos");
}
