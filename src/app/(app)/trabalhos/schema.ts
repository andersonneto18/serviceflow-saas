import { z } from "zod";

export const jobFormSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  clientId: z.string().min(1, "Escolha um cliente"),
  serviceId: z.string().optional(),
  assignedToUserId: z.string().optional(),
  status: z.enum([
    "rascunho",
    "agendado",
    "em_execucao",
    "em_pausa",
    "concluido",
    "cancelado",
  ]),
  location: z.string().optional(),
  scheduledAt: z.string().optional(),
  value: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Number(v)), "Valor inválido"),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
