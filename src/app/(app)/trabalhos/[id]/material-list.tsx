"use client";

import { useRef, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { addJobMaterial } from "./actions";

type Material = { id: string; description: string; quantity: string; unitPrice: string };

function money(value: number) {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

export function MaterialList({
  jobId,
  materials,
}: {
  jobId: string;
  materials: Material[];
}) {
  const [isPending, startTransition] = useTransition();
  const descRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const total = materials.reduce(
    (sum, m) => sum + Number(m.quantity) * Number(m.unitPrice),
    0
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        {materials.map((material) => (
          <div
            key={material.id}
            className="flex items-center justify-between border-b py-2.5 text-sm last:border-b-0"
          >
            <span>
              {material.description}
              <span className="text-muted-foreground">
                {" "}
                × {material.quantity}
              </span>
            </span>
            <span className="font-mono tabular-nums">
              {money(Number(material.quantity) * Number(material.unitPrice))}
            </span>
          </div>
        ))}
        {materials.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            Sem materiais ainda.
          </p>
        ) : (
          <div className="flex justify-between border-t pt-2 text-sm font-medium">
            <span>Total</span>
            <span className="font-mono tabular-nums">{money(total)}</span>
          </div>
        )}
      </div>

      <form
        className="grid grid-cols-[1fr_70px_90px_auto] gap-2"
        action={(formData) => {
          const description = String(formData.get("description") ?? "");
          const quantity = String(formData.get("quantity") ?? "1");
          const unitPrice = String(formData.get("unitPrice") ?? "0");
          startTransition(() =>
            addJobMaterial(jobId, description, quantity, unitPrice)
          );
          if (descRef.current) descRef.current.value = "";
          if (qtyRef.current) qtyRef.current.value = "";
          if (priceRef.current) priceRef.current.value = "";
        }}
      >
        <Input
          ref={descRef}
          name="description"
          placeholder="Material…"
          disabled={isPending}
        />
        <Input
          ref={qtyRef}
          name="quantity"
          placeholder="Qtd."
          inputMode="decimal"
          disabled={isPending}
        />
        <Input
          ref={priceRef}
          name="unitPrice"
          placeholder="Preço (€)"
          inputMode="decimal"
          disabled={isPending}
        />
        <Button type="submit" variant="outline" disabled={isPending}>
          +
        </Button>
      </form>
    </div>
  );
}
