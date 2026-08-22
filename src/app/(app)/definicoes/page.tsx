"use client";

import { OrganizationProfile, UserProfile } from "@clerk/nextjs";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DefinicoesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight">Definições</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="flex justify-center sm:justify-start">
          <UserProfile routing="hash" />
        </TabsContent>

        <TabsContent value="workspace" className="flex justify-center sm:justify-start">
          <OrganizationProfile routing="hash" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
