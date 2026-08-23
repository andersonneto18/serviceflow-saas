import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * Guarda um ficheiro no R2 e devolve o URL público dele.
 * A "key" é o caminho dentro do bucket, ex: "jobs/<id>/foto.jpg" — separar
 * por pastas evita ficheiros de workspaces diferentes a colidir por nome.
 */
export async function uploadToR2(
  key: string,
  file: Buffer,
  contentType: string
) {
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
