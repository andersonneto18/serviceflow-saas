"use client";

import { useRef, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapLink } from "@/components/map-link";

import { addClientAddress } from "./actions";

type Address = {
  id: string;
  label: string | null;
  street: string;
  city: string;
  postalCode: string | null;
};

export function AddressList({
  clientId,
  addresses,
}: {
  clientId: string;
  addresses: Address[];
}) {
  const [isPending, startTransition] = useTransition();
  const labelRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const postalRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {addresses.map((address) => {
          const full = `${address.street}, ${address.city}${address.postalCode ? " " + address.postalCode : ""}`;
          return (
            <div
              key={address.id}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div>
                {address.label && (
                  <p className="text-xs font-medium text-muted-foreground">
                    {address.label}
                  </p>
                )}
                <p>
                  {address.street}, {address.city}
                  {address.postalCode && ` · ${address.postalCode}`}
                </p>
              </div>
              <MapLink address={full} />
            </div>
          );
        })}
        {addresses.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Sem moradas registadas.
          </p>
        )}
      </div>

      <form
        className="grid grid-cols-2 gap-2 sm:grid-cols-[100px_1fr_1fr_100px_auto]"
        action={() => {
          startTransition(() =>
            addClientAddress(clientId, {
              label: labelRef.current?.value ?? "",
              street: streetRef.current?.value ?? "",
              city: cityRef.current?.value ?? "",
              postalCode: postalRef.current?.value ?? "",
            })
          );
          if (labelRef.current) labelRef.current.value = "";
          if (streetRef.current) streetRef.current.value = "";
          if (cityRef.current) cityRef.current.value = "";
          if (postalRef.current) postalRef.current.value = "";
        }}
      >
        <Input ref={labelRef} placeholder="Rótulo" disabled={isPending} />
        <Input ref={streetRef} placeholder="Rua" disabled={isPending} />
        <Input ref={cityRef} placeholder="Cidade" disabled={isPending} />
        <Input ref={postalRef} placeholder="Cód. postal" disabled={isPending} />
        <Button type="submit" variant="outline" disabled={isPending}>
          +
        </Button>
      </form>
    </div>
  );
}
