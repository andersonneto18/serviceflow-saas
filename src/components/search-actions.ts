"use server";

import { and, eq, ilike } from "drizzle-orm";

import { db } from "@/db";
import { clients, invoices, jobs, quotes, services } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

export type SearchResult = {
  group: string;
  title: string;
  meta: string;
  href: string;
};

export async function searchWorkspace(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const workspace = await getCurrentWorkspace();
  if (!workspace) return [];

  const like = `%${q}%`;
  const inWorkspace = eq(clients.workspaceId, workspace.id);

  const [clientRows, jobRows, serviceRows, quoteRows, invoiceRows] =
    await Promise.all([
      db
        .select({ id: clients.id, name: clients.name, email: clients.email })
        .from(clients)
        .where(and(inWorkspace, ilike(clients.name, like)))
        .limit(5),
      db
        .select({ id: jobs.id, title: jobs.title, clientName: clients.name })
        .from(jobs)
        .leftJoin(clients, eq(jobs.clientId, clients.id))
        .where(and(eq(jobs.workspaceId, workspace.id), ilike(jobs.title, like)))
        .limit(5),
      db
        .select({ id: services.id, name: services.name })
        .from(services)
        .where(and(eq(services.workspaceId, workspace.id), ilike(services.name, like)))
        .limit(5),
      db
        .select({
          id: quotes.id,
          total: quotes.total,
          status: quotes.status,
          clientName: clients.name,
        })
        .from(quotes)
        .leftJoin(clients, eq(quotes.clientId, clients.id))
        .where(and(eq(quotes.workspaceId, workspace.id), ilike(clients.name, like)))
        .limit(5),
      db
        .select({
          id: invoices.id,
          number: invoices.number,
          total: invoices.total,
          status: invoices.status,
          clientName: clients.name,
        })
        .from(invoices)
        .leftJoin(clients, eq(invoices.clientId, clients.id))
        .where(and(eq(invoices.workspaceId, workspace.id), ilike(clients.name, like)))
        .limit(5),
    ]);

  const results: SearchResult[] = [];

  for (const c of clientRows) {
    results.push({
      group: "Clientes",
      title: c.name,
      meta: c.email ?? "",
      href: "/clientes",
    });
  }
  for (const j of jobRows) {
    results.push({
      group: "Trabalhos",
      title: j.title,
      meta: j.clientName ?? "",
      href: `/trabalhos/${j.id}`,
    });
  }
  for (const s of serviceRows) {
    results.push({ group: "Serviços", title: s.name, meta: "", href: "/servicos" });
  }
  for (const quo of quoteRows) {
    results.push({
      group: "Orçamentos",
      title: `Orçamento · ${quo.clientName ?? ""}`,
      meta: `€${Number(quo.total).toFixed(2)} · ${quo.status}`,
      href: "/orcamentos",
    });
  }
  for (const inv of invoiceRows) {
    results.push({
      group: "Faturas",
      title: `Fatura #${inv.number} · ${inv.clientName ?? ""}`,
      meta: `€${Number(inv.total).toFixed(2)} · ${inv.status}`,
      href: "/faturas",
    });
  }

  return results;
}
