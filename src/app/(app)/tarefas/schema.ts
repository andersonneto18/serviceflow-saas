import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  priority: z.enum(["baixa", "normal", "alta", "urgente"]),
  dueDate: z.string().optional(),
  clientId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
