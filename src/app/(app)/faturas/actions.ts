"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { clients, invoiceItems, invoices } from "@/db/schema";
import { notifyWorkspace } from "@/lib/notifications";
import { getCurrentWorkspace } from "@/lib/workspace";

import { invoiceFormSchema, type InvoiceFormValues } from "./schema";

export async function createInvoice(values: InvoiceFormValues, send: boolean) {
  const parsed = invoiceFormSchema.parse(values);

  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  const subtotal = parsed.items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );
  const taxRate = Number(parsed.taxRate);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const [invoice] = await db
    .insert(invoices)
    .values({
      workspaceId: workspace.id,
      clientId: parsed.clientId,
      status: send ? "enviada" : "rascunho",
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
    })
    .returning();

  await db.insert(invoiceItems).values(
    parsed.items.map((item, index) => ({
      invoiceId: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      position: index,
    }))
  );

  redirect("/faturas");
}

export async function markInvoicePaid(invoiceId: string) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  const [invoice] = await db
    .update(invoices)
    .set({ status: "paga", paidAt: new Date() })
    .where(eq(invoices.id, invoiceId))
    .returning();

  const [client] = await db
    .select({ name: clients.name })
    .from(clients)
    .where(eq(clients.id, invoice.clientId));

  await notifyWorkspace(workspace.id, {
    type: "pagamento_recebido",
    title: "Pagamento recebido",
    body: `Fatura #${invoice.number}${client ? " · " + client.name : ""}`,
    href: "/pagamentos",
  });

  revalidatePath("/faturas");
  revalidatePath("/pagamentos");
}
