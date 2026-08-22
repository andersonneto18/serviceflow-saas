"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { updateClientNotes } from "./actions";

export function NotesEditor({
  clientId,
  initialNotes,
}: {
  clientId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        rows={6}
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        placeholder="Notas internas sobre este cliente…"
      />
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await updateClientNotes(clientId, notes);
            setSaved(true);
          })
        }
      >
        {isPending ? "A guardar…" : saved ? "Guardado ✓" : "Guardar notas"}
      </Button>
    </div>
  );
}
