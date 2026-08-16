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

import { createJob } from "./actions";
import { jobFormSchema, type JobFormValues } from "./schema";

const STATUS_LABEL: Record<JobFormValues["status"], string> = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  em_execucao: "Em execução",
  em_pausa: "Em pausa",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export function NewJobDialog({
  clients,
  services,
  members,
}: {
  clients: { id: string; name: string }[];
  services: { id: string; name: string }[];
  members: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: { status: "rascunho" },
  });

  async function onSubmit(values: JobFormValues) {
    await createJob(values);
    reset({ status: "rascunho", clientId: "", serviceId: "" });
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset({ status: "rascunho", clientId: "", serviceId: "" });
      }}
    >
      <DialogTrigger render={<Button size="sm" disabled={clients.length === 0} />}>
        <Plus />
        Novo trabalho
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo trabalho</DialogTitle>
          <DialogDescription>
            Criar um trabalho para um cliente deste workspace.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex: Instalação de 6 tomadas"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Cliente</Label>
              <Select
                value={watch("clientId")}
                onValueChange={(value) =>
                  setValue("clientId", value ?? "")
                }
              >
                <SelectTrigger className="w-full">
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
            <div className="flex flex-col gap-1.5">
              <Label>Serviço (opcional)</Label>
              <Select
                value={watch("serviceId")}
                onValueChange={(value) =>
                  setValue("serviceId", value ?? "")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sem serviço do catálogo" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scheduledAt">Data e hora</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                {...register("scheduledAt")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="value">Valor (€)</Label>
              <Input id="value" inputMode="decimal" {...register("value")} />
              {errors.value && (
                <p className="text-xs text-destructive">
                  {errors.value.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Localização</Label>
              <Input id="location" {...register("location")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Estado</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as JobFormValues["status"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABEL).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {members.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label>Responsável (opcional)</Label>
              <Select
                value={watch("assignedToUserId")}
                onValueChange={(value) =>
                  setValue("assignedToUserId", value ?? "")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sem responsável atribuído" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "A guardar…" : "Guardar trabalho"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
