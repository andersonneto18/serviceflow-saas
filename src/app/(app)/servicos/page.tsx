import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { services } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { NewServiceDialog } from "./new-service-dialog";

const PRICE_TYPE_LABEL: Record<string, string> = {
  fixo: "Fixo",
  hora: "Por hora",
  variavel: "Variável",
};

function formatPrice(
  price: string | null,
  priceType: string
): string {
  if (priceType === "variavel" || !price) return "Preço variável";
  const value = Number(price).toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
  });
  return priceType === "hora" ? `${value}/h` : value;
}

export default async function ServicosPage() {
  const workspace = await getCurrentWorkspace();

  const rows = workspace
    ? await db
        .select()
        .from(services)
        .where(eq(services.workspaceId, workspace.id))
        .orderBy(desc(services.createdAt))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Serviços</h1>
        <NewServiceDialog />
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há serviços</p>
          <p className="text-sm text-muted-foreground">
            Clique em &ldquo;Novo serviço&rdquo; para criar o catálogo.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead className="text-right">Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    {service.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {service.category ? (
                      <Badge variant="secondary">{service.category}</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {service.durationMinutes
                      ? `${service.durationMinutes} min`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatPrice(service.price, service.priceType)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
