"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import { createQuote } from "../actions";
import { quoteFormSchema, type QuoteFormValues } from "../schema";

function money(value: number) {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

export function QuoteForm({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      taxRate: "23",
      items: [{ description: "", quantity: "1", unitPrice: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const discount = watch("discount");
  const taxRate = watch("taxRate");

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const discountValue = Number(discount) || 0;
  const taxAmount = (subtotal - discountValue) * ((Number(taxRate) || 0) / 100);
  const total = subtotal - discountValue + taxAmount;

  async function onSubmit(values: QuoteFormValues, send: boolean) {
    await createQuote(values, send);
  }

  return (
    <form className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Cliente</Label>
            <Select
              value={watch("clientId")}
              onValueChange={(value) => setValue("clientId", value ?? "")}
            >
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue placeholder="Escolha um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-xs text-destructive">
                {errors.clientId.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <div className="hidden grid-cols-[1fr_90px_120px_32px] gap-3 px-1 text-xs font-medium text-muted-foreground sm:grid">
            <span>Descrição</span>
            <span>Qtd.</span>
            <span>Preço unit. (€)</span>
            <span />
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_90px_120px_32px]"
            >
              <Input
                placeholder="Ex: Instalação elétrica"
                {...register(`items.${index}.description`)}
              />
              <Input
                inputMode="decimal"
                placeholder="1"
                {...register(`items.${index}.quantity`)}
              />
              <Input
                inputMode="decimal"
                placeholder="0,00"
                {...register(`items.${index}.unitPrice`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
              >
                <Trash2 className="text-muted-foreground" />
              </Button>
            </div>
          ))}
          {errors.items?.root && (
            <p className="text-xs text-destructive">
              {errors.items.root.message}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() =>
              append({ description: "", quantity: "1", unitPrice: "" })
            }
          >
            <Plus />
            Adicionar item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 sm:w-80">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="discount">Desconto (€)</Label>
              <Input
                id="discount"
                inputMode="decimal"
                placeholder="0,00"
                {...register("discount")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="taxRate">IVA (%)</Label>
              <Input id="taxRate" inputMode="decimal" {...register("taxRate")} />
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t pt-4 sm:w-80">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Desconto</span>
              <span className="font-mono tabular-nums">
                -{money(discountValue)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>IVA</span>
              <span className="font-mono tabular-nums">{money(taxAmount)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="font-mono tabular-nums">{money(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={handleSubmit((values) => onSubmit(values, false))}
        >
          Guardar rascunho
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit((values) => onSubmit(values, true))}
        >
          {isSubmitting ? "A enviar…" : "Enviar ao cliente"}
        </Button>
      </div>
    </form>
  );
}
