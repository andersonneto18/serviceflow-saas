"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { messages } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

import { messageFormSchema, type MessageFormValues } from "./schema";

export async function createMessage(values: MessageFormValues) {
  const parsed = messageFormSchema.parse(values);

  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  const { userId } = await auth();

  await db.insert(messages).values({
    workspaceId: workspace.id,
    clientId: parsed.clientId,
    senderType: "equipa",
    authorUserId: userId,
    body: parsed.body,
  });

  revalidatePath("/inbox");
}
