import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getCurrentWorkspace } from "@/lib/workspace";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/command-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NotificationBell } from "@/components/notification-bell";
import { Plus } from "lucide-react";

const CREATE_OPTIONS = [
  "Novo cliente",
  "Novo trabalho",
  "Novo orçamento",
  "Nova tarefa",
  "Nova fatura",
  "Novo serviço",
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const workspace = await getCurrentWorkspace();

  return (
    <SidebarProvider>
      <AppSidebar workspaceName={workspace?.name} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
          </div>
          <div className="flex items-center gap-2">
            <CommandMenu />
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button size="sm" />}>
                <Plus />
                Criar
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {CREATE_OPTIONS.map((option) => (
                  <DropdownMenuItem key={option}>{option}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
