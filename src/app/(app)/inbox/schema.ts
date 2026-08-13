import { z } from "zod";

export const messageFormSchema = z.object({
  clientId: z.string().min(1, "Escolha um cliente"),
  body: z.string().min(1, "Escreva uma mensagem"),
});

export type MessageFormValues = z.infer<typeof messageFormSchema>;
