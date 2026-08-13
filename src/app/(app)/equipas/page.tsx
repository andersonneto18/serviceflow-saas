import { auth, clerkClient } from "@clerk/nextjs/server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { InviteMemberDialog } from "./invite-member-dialog";

const ROLE_LABEL: Record<string, string> = {
  "org:admin": "Administrador",
  "org:member": "Membro",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function EquipasPage() {
  const { orgId, has } = await auth();
  const canInvite = has({ role: "org:admin" });

  let members: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    role: string;
  }[] = [];
  let pending: { id: string; email: string; role: string }[] = [];

  if (orgId) {
    const client = await clerkClient();
    const [membershipList, invitationList] = await Promise.all([
      client.organizations.getOrganizationMembershipList({
        organizationId: orgId,
      }),
      client.organizations.getOrganizationInvitationList({
        organizationId: orgId,
        status: ["pending"],
      }),
    ]);

    members = membershipList.data.map((m) => ({
      id: m.id,
      name:
        [m.publicUserData?.firstName, m.publicUserData?.lastName]
          .filter(Boolean)
          .join(" ") ||
        m.publicUserData?.identifier ||
        "Utilizador",
      email: m.publicUserData?.identifier ?? "",
      imageUrl: m.publicUserData?.imageUrl ?? "",
      role: m.role,
    }));

    pending = invitationList.data.map((i) => ({
      id: i.id,
      email: i.emailAddress,
      role: i.role,
    }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Equipas</h1>
        {canInvite && <InviteMemberDialog />}
      </div>

      <div className="flex flex-col rounded-lg border">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 border-b p-4 last:border-b-0"
          >
            <Avatar className="h-8 w-8 shrink-0 rounded-full">
              <AvatarImage src={member.imageUrl} alt={member.name} />
              <AvatarFallback className="rounded-full bg-primary text-xs text-primary-foreground">
                {initials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{member.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {member.email}
              </p>
            </div>
            <Badge variant="secondary">
              {ROLE_LABEL[member.role] ?? member.role}
            </Badge>
          </div>
        ))}

        {pending.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center gap-3 border-b p-4 last:border-b-0"
          >
            <Avatar className="h-8 w-8 shrink-0 rounded-full">
              <AvatarFallback className="rounded-full bg-muted text-xs text-muted-foreground">
                {initials(invite.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{invite.email}</p>
              <p className="text-xs text-muted-foreground">
                Convite enviado, a aguardar resposta
              </p>
            </div>
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {ROLE_LABEL[invite.role] ?? invite.role}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
