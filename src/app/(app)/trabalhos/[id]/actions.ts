"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { jobMaterials, jobNotes, jobPhotos, jobTasks, jobs } from "@/db/schema";
import { uploadToR2 } from "@/lib/r2";
import { getCurrentWorkspace } from "@/lib/workspace";

/**
 * Confirma que este trabalho pertence ao workspace de quem está a pedir.
 * job_tasks/job_materials/job_notes/job_photos não têm workspaceId próprio
 * (só jobId) — sem este passo, qualquer pessoa autenticada, em qualquer
 * workspace, conseguia mexer em trabalhos de outros workspaces só por
 * saber o UUID do trabalho.
 */
async function assertJobAccess(jobId: string) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) throw new Error("Sem workspace ativo.");

  const [job] = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.workspaceId, workspace.id)));

  if (!job) throw new Error("Trabalho não encontrado neste workspace.");
}

export async function addJobTask(jobId: string, title: string) {
  if (!title.trim()) return;
  await assertJobAccess(jobId);
  await db.insert(jobTasks).values({ jobId, title: title.trim() });
  revalidatePath(`/trabalhos/${jobId}`);
}

export async function toggleJobTask(jobId: string, taskId: string, done: boolean) {
  await assertJobAccess(jobId);
  await db
    .update(jobTasks)
    .set({ done })
    .where(and(eq(jobTasks.id, taskId), eq(jobTasks.jobId, jobId)));
  revalidatePath(`/trabalhos/${jobId}`);
}

export async function addJobMaterial(
  jobId: string,
  description: string,
  quantity: string,
  unitPrice: string
) {
  if (!description.trim()) return;
  await assertJobAccess(jobId);
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
  await assertJobAccess(jobId);
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
  await assertJobAccess(jobId);

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop() || "jpg";
  const key = `jobs/${jobId}/${crypto.randomUUID()}.${extension}`;

  const url = await uploadToR2(key, buffer, file.type || "image/jpeg");

  await db.insert(jobPhotos).values({ jobId, url });

  revalidatePath(`/trabalhos/${jobId}`);
}
