"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { createClient } from "./actions";
import { clientFormSchema, type ClientFormValues } from "./schema";

export function NewClientDialog() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: { status: "potencial" },
  });

  async function onSubmit(values: ClientFormValues) {
    await createClient(values);
    reset({ status: "potencial" });
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset({ status: "potencial" });
      }}
    >
      <DialogTrigger render={<Button size="sm" />}>
        <Plus />
        Novo cliente
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo cliente</DialogTitle>
          <DialogDescription>
            Adicionar um cliente a este workspace.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" {...register("company")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Estado</Label>
            <Select
              value={watch("status")}
              onValueChange={(value) =>
                setValue("status", value as ClientFormValues["status"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="potencial">Potencial</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" rows={3} {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "A guardar…" : "Guardar cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
