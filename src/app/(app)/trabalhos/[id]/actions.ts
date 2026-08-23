"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { jobMaterials, jobNotes, jobPhotos, jobTasks } from "@/db/schema";
import { uploadToR2 } from "@/lib/r2";

export async function addJobTask(jobId: string, title: string) {
  if (!title.trim()) return;
  await db.insert(jobTasks).values({ jobId, title: title.trim() });
  revalidatePath(`/trabalhos/${jobId}`);
}

export async function toggleJobTask(jobId: string, taskId: string, done: boolean) {
  await db.update(jobTasks).set({ done }).where(eq(jobTasks.id, taskId));
  revalidatePath(`/trabalhos/${jobId}`);
}

export async function addJobMaterial(
  jobId: string,
  description: string,
  quantity: string,
  unitPrice: string
) {
  if (!description.trim()) return;
  await db.insert(jobMaterials).values({
    jobId,
    description: description.trim(),
    quantity: quantity || "1",
    unitPrice: unitPrice || "0",
  });
  revalidatePath(`/trabalhos/${jobId}`);
}

export async function addJobNote(jobId: string, body: string) {
  if (!body.trim()) return;
  const { userId } = await auth();
  await db.insert(jobNotes).values({
    jobId,
    authorUserId: userId,
    body: body.trim(),
  });
  revalidatePath(`/trabalhos/${jobId}`);
}

export async function uploadJobPhoto(jobId: string, formData: FormData) {
  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return;

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop() || "jpg";
  const key = `jobs/${jobId}/${crypto.randomUUID()}.${extension}`;

  const url = await uploadToR2(key, buffer, file.type || "image/jpeg");

  await db.insert(jobPhotos).values({ jobId, url });

  revalidatePath(`/trabalhos/${jobId}`);
}
