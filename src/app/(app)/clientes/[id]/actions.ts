"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { clientAddresses, clientDocuments, clients } from "@/db/schema";
import { uploadToR2 } from "@/lib/r2";
import { getCurrentWorkspace } from "@/lib/workspace";

/**
 * Confirma que este cliente pertence ao workspace de quem está a pedir —
 * mesma razão do assertJobAccess em trabalhos/[id]/actions.ts.
 */
async function assertClientAccess(clientId: string) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) throw new Error("Sem workspace ativo.");

  const [client] = await db
    .select({ id: clients.id })
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.workspaceId, workspace.id)));

  if (!client) throw new Error("Cliente não encontrado neste workspace.");
}

export async function updateClientNotes(clientId: string, notes: string) {
  await assertClientAccess(clientId);

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
  await assertClientAccess(clientId);

  await db.insert(clientAddresses).values({
    clientId,
    label: values.label || null,
    street: values.street.trim(),
    city: values.city.trim(),
    postalCode: values.postalCode || null,
  });

  revalidatePath(`/clientes/${clientId}`);
}

export async function uploadClientDocument(
  clientId: string,
  formData: FormData
) {
  const file = formData.get("document") as File | null;
  if (!file || file.size === 0) return;
  await assertClientAccess(clientId);

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop() || "pdf";
  const key = `clients/${clientId}/${crypto.randomUUID()}.${extension}`;

  const url = await uploadToR2(
    key,
    buffer,
    file.type || "application/octet-stream"
  );

  await db.insert(clientDocuments).values({
    clientId,
    name: file.name,
    url,
  });

  revalidatePath(`/clientes/${clientId}`);
}
