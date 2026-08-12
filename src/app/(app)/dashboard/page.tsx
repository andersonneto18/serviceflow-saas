import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

const METRICS = [
  { label: "Receita", value: "€12.480", delta: "+12,4%", sub: "este mês" },
  {
    label: "Trabalhos ativos",
    value: "24",
    delta: "8",
    sub: "para esta semana",
  },
  {
    label: "Orçamentos pendentes",
    value: "€8.420",
    delta: "12",
    sub: "aguardando resposta",
  },
  { label: "Clientes", value: "184", delta: "+14", sub: "este mês" },
];

const AGENDA = [
  { time: "09:00", client: "João Silva", service: "Instalação elétrica · Lisboa", status: "Confirmado" },
  { time: "11:30", client: "Maria Costa", service: "Manutenção · Lisboa", status: "Confirmado" },
  { time: "14:00", client: "Pedro Santos", service: "Reparação · Sintra", status: "Pendente" },
  { time: "16:30", client: "Ana Martins", service: "Visita técnica · Cascais", status: "Confirmado" },
];

const RECENT_JOBS = [
  { client: "João Silva", service: "Instalação elétrica", status: "Em execução", value: "€450" },
  { client: "Maria Costa", service: "Manutenção jardim", status: "Agendado", value: "€120" },
  { client: "Pedro Santos", service: "Reparação", status: "Concluído", value: "€280" },
];

const STATUS_VARIANT: Record<string, string> = {
  "Em execução": "bg-primary/10 text-primary",
  Agendado: "bg-muted text-muted-foreground",
  Concluído: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bom dia, Anderson 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aqui está o resumo do teu negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight tabular-nums">
                {metric.value}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <Badge variant="secondary" className="tabular-nums">
                  {metric.delta}
                </Badge>
                <span className="text-muted-foreground">{metric.sub}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">Agenda de hoje</CardTitle>
            <Link
              href="#"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Ver calendário
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col">
            {AGENDA.map((item) => (
              <div
                key={item.client}
                className="flex items-center gap-3 border-t py-3 first:border-t-0 first:pt-0"
              >
                <span className="w-11 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                  {item.time}
                </span>
                <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.client}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.service}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">Trabalhos recentes</CardTitle>
            <Link
              href="/trabalhos"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {RECENT_JOBS.map((job) => (
                  <TableRow key={job.client}>
                    <TableCell className="font-medium">{job.client}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {job.service}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={STATUS_VARIANT[job.status]}
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {job.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
