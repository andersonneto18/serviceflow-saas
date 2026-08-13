import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  category: z.string().optional(),
  priceType: z.enum(["fixo", "hora", "variavel"]),
  price: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Number(v)), "Preço inválido"),
  durationMinutes: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Number(v)), "Duração inválida"),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
