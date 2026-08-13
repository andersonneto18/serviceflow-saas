import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { NewProductDialog } from "./new-product-dialog";

function formatPrice(price: string): string {
  return Number(price).toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
  });
}

export default async function ProdutosPage() {
  const workspace = await getCurrentWorkspace();

  const rows = workspace
    ? await db
        .select()
        .from(products)
        .where(eq(products.workspaceId, workspace.id))
        .orderBy(desc(products.createdAt))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          Produtos & Materiais
        </h1>
        <NewProductDialog />
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">
            Ainda não há produtos nem materiais
          </p>
          <p className="text-sm text-muted-foreground">
            Clique em &ldquo;Novo produto&rdquo; para adicionar o primeiro.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead className="text-right">Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.unit || "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatPrice(product.price)}
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
