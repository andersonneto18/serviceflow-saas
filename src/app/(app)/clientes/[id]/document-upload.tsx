"use client";

import { useRef, useTransition } from "react";
import { FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import { uploadClientDocument } from "./actions";

type Document = { id: string; name: string; url: string };

export function DocumentUpload({
  clientId,
  documents,
}: {
  clientId: string;
  documents: Document[];
}) {
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    formData.set("document", files[0]);
    startTransition(() => uploadClientDocument(clientId, formData));
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border p-3 text-sm hover:bg-muted"
          >
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{doc.name}</span>
          </a>
        ))}
        {documents.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Sem documentos ainda.
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
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
        {isPending ? "A enviar…" : "Enviar documento"}
      </Button>
    </div>
  );
}
