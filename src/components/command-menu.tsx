"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import { searchWorkspace, type SearchResult } from "./search-actions";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

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

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      searchWorkspace(query)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  const groups = Array.from(new Set(results.map((r) => r.group)));

  function select(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

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
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
        title="Pesquisa global"
        description="Pesquisar clientes, trabalhos, orçamentos, faturas e serviços"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Pesquisar clientes, trabalhos, orçamentos, faturas..."
          />
          <CommandList>
            {!loading && query.trim() && results.length === 0 && (
              <CommandEmpty>
                Sem resultados para &ldquo;{query}&rdquo;.
              </CommandEmpty>
            )}
            {!query.trim() && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                Comece a escrever para pesquisar.
              </p>
            )}
            {groups.map((group) => (
              <CommandGroup key={group} heading={group}>
                {results
                  .filter((r) => r.group === group)
                  .map((item, index) => (
                    <CommandItem
                      key={`${item.group}-${index}`}
                      value={`${item.group}-${index}`}
                      onSelect={() => select(item.href)}
                    >
                      <div className="flex flex-col">
                        <span>{item.title}</span>
                        {item.meta && (
                          <span className="text-xs text-muted-foreground">
                            {item.meta}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
