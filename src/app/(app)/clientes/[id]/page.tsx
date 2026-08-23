import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { clientAddresses, clientDocuments, clients, jobs, quotes } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AddressList } from "./address-list";
import { DocumentUpload } from "./document-upload";
import { NotesEditor } from "./notes-editor";

const CLIENT_STATUS_LABEL: Record<string, string> = {
  ativo: "Ativo",
  potencial: "Potencial",
  inativo: "Inativo",
};

const JOB_STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  em_execucao: "Em execução",
  em_pausa: "Em pausa",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const QUOTE_STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  enviado: "Enviado",
  aceite: "Aceite",
  rejeitado: "Rejeitado",
  alteracao_pedida: "Alteração pedida",
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getCurrentWorkspace();
  if (!workspace) notFound();

  const [client] = await db.select().from(clients).where(eq(clients.id, id));
  if (!client) notFound();

  const [addresses, clientJobs, clientQuotes, documents] = await Promise.all([
    db
      .select()
      .from(clientAddresses)
      .where(eq(clientAddresses.clientId, id)),
    db
      .select()
      .from(jobs)
      .where(eq(jobs.clientId, id))
      .orderBy(desc(jobs.createdAt)),
    db
      .select()
      .from(quotes)
      .where(eq(quotes.clientId, id))
      .orderBy(desc(quotes.createdAt)),
    db
      .select()
      .from(clientDocuments)
      .where(eq(clientDocuments.clientId, id)),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{client.name}</h1>
          <p className="text-sm text-muted-foreground">
            {client.company || "—"}
          </p>
        </div>
        <Badge variant="secondary">{CLIENT_STATUS_LABEL[client.status]}</Badge>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="quotes">Orçamentos</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{client.email || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Telefone</p>
                  <p className="text-sm">{client.phone || "—"}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Moradas
                </p>
                <AddressList clientId={client.id} addresses={addresses} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="flex flex-col">
              {clientJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/trabalhos/${job.id}`}
                  className="flex items-center justify-between border-b py-2.5 text-sm last:border-b-0 hover:text-primary"
                >
                  <span>{job.title}</span>
                  <Badge variant="secondary">
                    {JOB_STATUS_LABEL[job.status]}
                  </Badge>
                </Link>
              ))}
              {clientJobs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Sem trabalhos ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes">
          <Card>
            <CardContent className="flex flex-col">
              {clientQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between border-b py-2.5 text-sm last:border-b-0"
                >
                  <span className="font-mono tabular-nums">
                    {Number(quote.total).toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                  <Badge variant="secondary">
                    {QUOTE_STATUS_LABEL[quote.status]}
                  </Badge>
                </div>
              ))}
              {clientQuotes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Sem orçamentos ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardContent>
              <NotesEditor clientId={client.id} initialNotes={client.notes ?? ""} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent>
              <DocumentUpload clientId={client.id} documents={documents} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
