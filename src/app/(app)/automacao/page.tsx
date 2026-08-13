import { eq } from "drizzle-orm";

import { db } from "@/db";
import { automations } from "@/db/schema";
import { AUTOMATIONS } from "@/lib/automations";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Card, CardContent } from "@/components/ui/card";

import { AutomationToggle } from "./automation-toggle";

export default async function AutomacaoPage() {
  const workspace = await getCurrentWorkspace();

  const rows = workspace
    ? await db
        .select({ key: automations.key, active: automations.active })
        .from(automations)
        .where(eq(automations.workspaceId, workspace.id))
    : [];

  const activeByKey = new Map(rows.map((r) => [r.key, r.active]));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Automação</h1>
        <p className="text-sm text-muted-foreground">
          Regras que a app corre sozinha. Desligue as que não fizerem sentido
          para o seu negócio.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {AUTOMATIONS.map((automation) => (
          <Card key={automation.key}>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  Quando: {automation.when}
                </p>
                <p className="text-sm text-muted-foreground">
                  Então: {automation.then}
                </p>
              </div>
              <AutomationToggle
                automationKey={automation.key}
                active={activeByKey.get(automation.key) ?? true}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Por agora só existem estas duas regras, fixas — ainda não é possível
        criar regras próprias.
      </p>
    </div>
  );
}
