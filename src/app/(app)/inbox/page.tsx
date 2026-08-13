import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { clients, messages } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { NewMessageDialog } from "./new-message-dialog";

const SENDER_LABEL: Record<string, string> = {
  cliente: "Cliente",
  equipa: "Equipa",
  sistema: "Sistema",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function InboxPage() {
  const workspace = await getCurrentWorkspace();

  const [messageRows, clientRows] = workspace
    ? await Promise.all([
        db
          .select({
            id: messages.id,
            body: messages.body,
            senderType: messages.senderType,
            createdAt: messages.createdAt,
            clientName: clients.name,
          })
          .from(messages)
          .leftJoin(clients, eq(messages.clientId, clients.id))
          .where(eq(messages.workspaceId, workspace.id))
          .orderBy(desc(messages.createdAt)),
        db
          .select({ id: clients.id, name: clients.name })
          .from(clients)
          .where(eq(clients.workspaceId, workspace.id)),
      ])
    : [[], []];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Inbox</h1>
        <NewMessageDialog clients={clientRows} />
      </div>

      {clientRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há clientes</p>
          <p className="text-sm text-muted-foreground">
            Crie primeiro um cliente em Clientes para poder enviar mensagens.
          </p>
        </div>
      ) : messageRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">Ainda não há mensagens</p>
          <p className="text-sm text-muted-foreground">
            Clique em &ldquo;Nova mensagem&rdquo; para começar.
          </p>
        </div>
      ) : (
        <div className="flex flex-col rounded-lg border">
          {messageRows.map((message) => (
            <div
              key={message.id}
              className="flex items-start gap-3 border-b p-4 last:border-b-0"
            >
              <Avatar className="h-8 w-8 shrink-0 rounded-full">
                <AvatarFallback className="rounded-full bg-muted text-xs">
                  {initials(message.clientName ?? "?")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">
                    {message.clientName ?? "Sem cliente"}
                  </p>
                  <Badge variant="secondary" className="text-[10px]">
                    {SENDER_LABEL[message.senderType]}
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {message.body}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(message.createdAt).toLocaleString("pt-PT", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
