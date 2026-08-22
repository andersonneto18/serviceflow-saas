"use client";

import { useTransition } from "react";

import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

import { setNotificationsEnabled } from "./actions";

export function NotificationsToggle({ enabled }: { enabled: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Notificações</p>
          <p className="text-sm text-muted-foreground">
            Receber notificações de novos clientes, orçamentos aceites,
            pagamentos e tarefas atribuídas a si.
          </p>
        </div>
        <Switch
          checked={enabled}
          disabled={isPending}
          onCheckedChange={(checked) =>
            startTransition(() => setNotificationsEnabled(checked === true))
          }
        />
      </CardContent>
    </Card>
  );
}
