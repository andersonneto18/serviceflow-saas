import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Abre o Google Maps já com a morada como destino, pronto para navegar.
 * Não usa nenhuma API do Google — é só um link com o formato que o
 * Google Maps reconhece, por isso não precisa de conta nem chave.
 */
export function MapLink({ address }: { address: string }) {
  const href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <Button
      variant="ghost"
      size="sm"
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
    >
      <MapPin />
      Como chegar
    </Button>
  );
}
