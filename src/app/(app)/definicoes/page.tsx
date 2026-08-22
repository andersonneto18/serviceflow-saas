"use client";

import { useEffect, useState } from "react";
import { OrganizationProfile, UserProfile } from "@clerk/nextjs";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getNotificationsEnabled } from "./actions";
import { NotificationsToggle } from "./notifications-toggle";

export default function DefinicoesPage() {
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);

  useEffect(() => {
    getNotificationsEnabled().then(setNotificationsEnabledState);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight">Definições</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="flex justify-center sm:justify-start">
          <UserProfile routing="hash" />
        </TabsContent>

        <TabsContent value="workspace" className="flex justify-center sm:justify-start">
          <OrganizationProfile routing="hash" />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsToggle enabled={notificationsEnabled} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
