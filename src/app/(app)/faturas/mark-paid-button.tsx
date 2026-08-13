"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

import { markInvoicePaid } from "./actions";

export function MarkPaidButton({ invoiceId }: { invoiceId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => markInvoicePaid(invoiceId))}
    >
      <Check />
      Marcar como paga
    </Button>
  );
}
