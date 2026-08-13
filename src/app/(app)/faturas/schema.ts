import { z } from "zod";

export const invoiceItemSchema = z.object({
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

export const invoiceFormSchema = z.object({
  clientId: z.string().min(1, "Escolha um cliente"),
  dueDate: z.string().optional(),
  taxRate: z
    .string()
    .min(1, "Obrigatória")
    .refine((v) => !Number.isNaN(Number(v)), "Taxa inválida"),
  items: z.array(invoiceItemSchema).min(1, "Adicione pelo menos um item"),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
