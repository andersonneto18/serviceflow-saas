"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { clientAddresses, clients } from "@/db/schema";

export async function updateClientNotes(clientId: string, notes: string) {
  await db
    .update(clients)
    .set({ notes: notes || null, updatedAt: new Date() })
    .where(eq(clients.id, clientId));

  revalidatePath(`/clientes/${clientId}`);
}

export async function addClientAddress(
  clientId: string,
  values: {
    label: string;
    street: string;
    city: string;
    postalCode: string;
  }
) {
  if (!values.street.trim() || !values.city.trim()) return;

  await db.insert(clientAddresses).values({
    clientId,
    label: values.label || null,
    street: values.street.trim(),
    city: values.city.trim(),
    postalCode: values.postalCode || null,
  });

  revalidatePath(`/clientes/${clientId}`);
}
