import { z } from "zod";

export const clientFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  company: z.string().optional(),
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  status: z.enum(["ativo", "potencial", "inativo"]),
  notes: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
