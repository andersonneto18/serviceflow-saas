"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { respondToQuote } from "./actions";

export function RespondButtons({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function respond(decision: "aceite" | "rejeitado") {
    startTransition(async () => {
      await respondToQuote(token, decision);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => respond("rejeitado")}
      >
        Rejeitar
      </Button>
      <Button
        type="button"
        disabled={isPending}
        onClick={() => respond("aceite")}
      >
        Aceitar orçamento
      </Button>
    </div>
  );
}
