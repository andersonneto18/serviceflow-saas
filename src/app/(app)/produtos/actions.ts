"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { products } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";

import { productFormSchema, type ProductFormValues } from "./schema";

export async function createProduct(values: ProductFormValues) {
  const parsed = productFormSchema.parse(values);

  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    throw new Error("Sem workspace ativo.");
  }

  await db.insert(products).values({
    workspaceId: workspace.id,
    name: parsed.name,
    unit: parsed.unit || null,
    price: parsed.price,
  });

  revalidatePath("/produtos");
}
