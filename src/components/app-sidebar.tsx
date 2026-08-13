"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LayoutGrid,
  Inbox,
  Calendar,
  Briefcase,
  CheckSquare,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Tag,
  Package,
  Route as RouteIcon,
  BarChart3,
  Zap,
  MessageCircle,
  Globe,
  Bell,
  Plug,
  Settings,
  ChevronsUpDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  disabled?: boolean;
};

const workspaceNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutGrid },
  { title: "Inbox", url: "#", icon: Inbox, disabled: true },
  { title: "Calendário", url: "#", icon: Calendar, disabled: true },
  { title: "Trabalhos", url: "/trabalhos", icon: Briefcase },
  { title: "Tarefas", url: "#", icon: CheckSquare, disabled: true },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Orçamentos", url: "/orcamentos", icon: FileText },
  { title: "Faturas", url: "#", icon: Receipt, disabled: true },
  { title: "Pagamentos", url: "#", icon: CreditCard, disabled: true },
];

const gestaoNav: NavItem[] = [
  { title: "Serviços", url: "/servicos", icon: Tag },
  { title: "Produtos & Materiais", url: "#", icon: Package, disabled: true },
  { title: "Equipas", url: "#", icon: Users, disabled: true },
  { title: "Rotas", url: "#", icon: RouteIcon, disabled: true },
  { title: "Relatórios", url: "#", icon: BarChart3, disabled: true },
  { title: "Automação", url: "#", icon: Zap, disabled: true },
];

const comunicacaoNav: NavItem[] = [
  { title: "Mensagens", url: "#", icon: MessageCircle, disabled: true },
  { title: "Portal do cliente", url: "#", icon: Globe, disabled: true },
  { title: "Notificações", url: "#", icon: Bell, disabled: true },
];

const sistemaNav: NavItem[] = [
  { title: "Integrações", url: "#", icon: Plug, disabled: true },
  { title: "Definições", url: "#", icon: Settings, disabled: true },
];

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.disabled ? (
                <SidebarMenuButton
                  disabled
                  className="cursor-not-allowed opacity-50"
                  tooltip={`${item.title} (em breve)`}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={pathname.startsWith(item.url)}
                  tooltip={item.title}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar({ workspaceName }: { workspaceName?: string }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const displayName = isLoaded
    ? user?.fullName || user?.primaryEmailAddress?.emailAddress || "Utilizador"
    : "A carregar…";
  const initials = isLoaded
    ? (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") ||
      displayName.slice(0, 2).toUpperCase()
    : "…";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            S
          </div>
          <span className="truncate text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            {workspaceName ?? "Serviza"}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="Workspace" items={workspaceNav} pathname={pathname} />
        <NavGroup label="Gestão" items={gestaoNav} pathname={pathname} />
        <NavGroup
          label="Comunicação"
          items={comunicacaoNav}
          pathname={pathname}
        />
        <NavGroup label="Sistema" items={sistemaNav} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
            <Avatar className="h-7 w-7 rounded-full">
              <AvatarImage src={user?.imageUrl} alt={displayName} />
              <AvatarFallback className="rounded-full bg-primary text-xs text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress ?? ""}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-56">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Preferências</DropdownMenuItem>
            <DropdownMenuItem>Alterar workspace</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ajuda</DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/sign-in" })}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
