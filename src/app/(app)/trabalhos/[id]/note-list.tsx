"use client";

import { useRef, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { addJobNote } from "./actions";

type Note = { id: string; body: string; createdAt: Date };

export function NoteList({ jobId, notes }: { jobId: string; notes: Note[] }) {
  const [isPending, startTransition] = useTransition();
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        {notes.map((note) => (
          <div key={note.id} className="rounded-md border p-3 text-sm">
            <p>{note.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(note.createdAt).toLocaleString("pt-PT", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-sm text-muted-foreground">Sem notas ainda.</p>
        )}
      </div>

      <form
        className="flex flex-col gap-2"
        action={(formData) => {
          const body = String(formData.get("body") ?? "");
          startTransition(() => addJobNote(jobId, body));
          if (bodyRef.current) bodyRef.current.value = "";
        }}
      >
        <Textarea
          ref={bodyRef}
          name="body"
          rows={2}
          placeholder="Escrever uma nota…"
          disabled={isPending}
        />
        <Button type="submit" variant="outline" className="w-fit" disabled={isPending}>
          Adicionar nota
        </Button>
      </form>
    </div>
  );
}
