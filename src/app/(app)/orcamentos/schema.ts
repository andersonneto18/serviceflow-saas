import { z } from "zod";

export const quoteItemSchema = z.object({
  description: z.string().min(1, "Obrigatório"),
  quantity: z
    .string()
    .min(1, "Obrigatório")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Inválida"),
  unitPrice: z
    .string()
    .min(1, "Obrigatório")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, "Inválido"),
});

export const quoteFormSchema = z.object({
  clientId: z.string().min(1, "Escolha um cliente"),
  discount: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Number(v)), "Desconto inválido"),
  taxRate: z
    .string()
    .min(1, "Obrigatória")
    .refine((v) => !Number.isNaN(Number(v)), "Taxa inválida"),
  items: z.array(quoteItemSchema).min(1, "Adicione pelo menos um item"),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
