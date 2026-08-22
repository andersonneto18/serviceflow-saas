import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { renderToBuffer } from "@react-pdf/renderer";

import { db } from "@/db";
import { clients, invoiceItems, invoices } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

import { InvoicePdf } from "./invoice-pdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const workspace = await getCurrentWorkspace();
  if (!workspace) notFound();

  const [invoice] = await db
    .select({
      id: invoices.id,
      number: invoices.number,
      status: invoices.status,
      dueDate: invoices.dueDate,
      subtotal: invoices.subtotal,
      taxAmount: invoices.taxAmount,
      total: invoices.total,
      createdAt: invoices.createdAt,
      clientName: clients.name,
    })
    .from(invoices)
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .where(eq(invoices.id, id));

  if (!invoice) notFound();

  const items = await db
    .select({
      description: invoiceItems.description,
      quantity: invoiceItems.quantity,
      unitPrice: invoiceItems.unitPrice,
    })
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, id));

  const buffer = await renderToBuffer(
    InvoicePdf({
      workspaceName: workspace.name,
      number: invoice.number,
      status: invoice.status,
      createdAt: invoice.createdAt,
      dueDate: invoice.dueDate,
      clientName: invoice.clientName ?? "—",
      subtotal: invoice.subtotal,
      taxAmount: invoice.taxAmount,
      total: invoice.total,
      items,
    })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="fatura-${invoice.number}.pdf"`,
    },
  });
}
