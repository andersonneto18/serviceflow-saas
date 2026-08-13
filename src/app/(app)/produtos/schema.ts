import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  unit: z.string().optional(),
  price: z
    .string()
    .min(1, "O preço é obrigatório")
    .refine((v) => !Number.isNaN(Number(v)), "Preço inválido"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
