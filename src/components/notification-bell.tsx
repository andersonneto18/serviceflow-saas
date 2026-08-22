"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notification-actions";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  href: string | null;
  read: boolean;
  createdAt: Date;
};

export function NotificationBell() {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    getNotifications().then(setItems);
  }, []);

  useEffect(() => {
    if (open) {
      getNotifications().then(setItems);
    }
  }, [open]);

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Notificações" className="relative" />
        }
      >
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm font-medium">Notificações</span>
          {unreadCount > 0 && (
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() =>
                startTransition(async () => {
                  await markAllNotificationsRead();
                  setItems((prev) => prev.map((n) => ({ ...n, read: true })));
                })
              }
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            Sem notificações.
          </p>
        ) : (
          items.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-0.5 whitespace-normal"
              onClick={() => {
                if (!notification.read) {
                  startTransition(() => markNotificationRead(notification.id));
                }
                if (notification.href) router.push(notification.href);
              }}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                {!notification.read && (
                  <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                )}
                {notification.title}
              </span>
              {notification.body && (
                <span className="text-xs text-muted-foreground">
                  {notification.body}
                </span>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
