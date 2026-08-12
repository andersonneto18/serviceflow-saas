"use client";

import * as React from "react";
import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

const RESULTS = [
  {
    group: "Clientes",
    title: "João Silva",
    meta: "3 trabalhos · 2 orçamentos · 4 faturas",
  },
  { group: "Clientes", title: "Maria Costa", meta: "5 trabalhos · Lisboa" },
  {
    group: "Trabalhos",
    title: "Instalação de 6 tomadas",
    meta: "João Silva · Quarta-feira, 10:00",
  },
  { group: "Orçamentos", title: "Orçamento #1042", meta: "€285 · Aceite" },
  { group: "Faturas", title: "Fatura #1042", meta: "€285 · Paga" },
  { group: "Serviços", title: "Instalação elétrica", meta: "€80/h" },
];

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const groups = Array.from(new Set(RESULTS.map((r) => r.group)));

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-muted-foreground font-normal"
        onClick={() => setOpen(true)}
      >
        <Search />
        Pesquisar
        <kbd className="ml-2 rounded border bg-muted px-1.5 font-mono text-[10px]">
          Ctrl K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Pesquisa global"
        description="Pesquisar clientes, trabalhos, orçamentos, faturas e serviços"
      >
        <CommandInput placeholder="Pesquisar clientes, trabalhos, orçamentos, faturas..." />
        <CommandList>
          <CommandEmpty>Sem resultados.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group} heading={group}>
              {RESULTS.filter((r) => r.group === group).map((item) => (
                <CommandItem
                  key={item.title}
                  value={`${item.title} ${item.meta}`}
                  onSelect={() => setOpen(false)}
                >
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.meta}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
