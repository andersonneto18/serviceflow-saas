"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={async () => {
        const url = `${window.location.origin}/orcamento/${token}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check /> : <LinkIcon />}
      {copied ? "Copiado" : "Copiar link"}
    </Button>
  );
}
