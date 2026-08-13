import { and, eq, gte } from "drizzle-orm";

import { db } from "@/db";
import { clients, invoices, jobs, quotes } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function money(value: number) {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

export default async function RelatoriosPage() {
  const workspace = await getCurrentWorkspace();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [paidInvoices, completedJobs, newClients, respondedQuotes] =
    workspace
      ? await Promise.all([
          db
            .select({ total: invoices.total })
            .from(invoices)
            .where(
              and(
                eq(invoices.workspaceId, workspace.id),
                eq(invoices.status, "paga")
              )
            ),
          db
            .select({ id: jobs.id })
            .from(jobs)
            .where(
              and(
                eq(jobs.workspaceId, workspace.id),
                eq(jobs.status, "concluido"),
                gte(jobs.updatedAt, startOfMonth)
              )
            ),
          db
            .select({ id: clients.id })
            .from(clients)
            .where(
              and(
                eq(clients.workspaceId, workspace.id),
                gte(clients.createdAt, startOfMonth)
              )
            ),
          db
            .select({ status: quotes.status })
            .from(quotes)
            .where(
              and(
                eq(quotes.workspaceId, workspace.id),
                gte(quotes.createdAt, startOfMonth)
              )
            ),
        ])
      : [[], [], [], []];

  const revenue = paidInvoices.reduce((sum, i) => sum + Number(i.total), 0);
  const responded = respondedQuotes.filter((q) =>
    ["aceite", "rejeitado"].includes(q.status)
  );
  const accepted = respondedQuotes.filter((q) => q.status === "aceite");
  const acceptanceRate =
    responded.length > 0
      ? Math.round((accepted.length / responded.length) * 100)
      : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Relatórios</h1>
        <p className="text-sm text-muted-foreground">
          Resumo deste mês (desde o dia 1).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Receita total (faturas pagas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {money(revenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Trabalhos concluídos este mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {completedJobs.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Clientes novos este mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {newClients.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Taxa de orçamentos aceites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {acceptanceRate === null ? "—" : `${acceptanceRate}%`}
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        &ldquo;Receita total&rdquo; soma todas as faturas pagas até hoje (não
        só este mês). Os restantes números são só deste mês.
      </p>
    </div>
  );
}
