"use client";

import { useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateJobStatus } from "./actions";
import type { JobFormValues } from "./schema";

const STATUS_LABEL: Record<JobFormValues["status"], string> = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  em_execucao: "Em execução",
  em_pausa: "Em pausa",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export function JobStatusSelect({
  jobId,
  status,
}: {
  jobId: string;
  status: JobFormValues["status"];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={isPending}
      onValueChange={(value) =>
        startTransition(() =>
          updateJobStatus(jobId, value as JobFormValues["status"])
        )
      }
    >
      <SelectTrigger size="sm" className="w-[150px] border-none bg-transparent shadow-none">
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
  );
}
