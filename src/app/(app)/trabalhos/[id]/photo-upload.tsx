"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import { uploadJobPhoto } from "./actions";

type Photo = { id: string; url: string };

export function PhotoUpload({
  jobId,
  photos,
}: {
  jobId: string;
  photos: Photo[];
}) {
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    formData.set("photo", files[0]);
    startTransition(() => uploadJobPhoto(jobId, formData));
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((photo) => (
          <a
            key={photo.id}
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square overflow-hidden rounded-md border bg-muted"
          >
            <Image
              src={photo.url}
              alt="Foto do trabalho"
              fill
              sizes="200px"
              className="object-cover"
              unoptimized
            />
          </a>
        ))}
      </div>
      {photos.length === 0 && (
        <p className="text-sm text-muted-foreground">Sem fotos ainda.</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload />
        {isPending ? "A enviar…" : "Enviar foto"}
      </Button>
    </div>
  );
}
