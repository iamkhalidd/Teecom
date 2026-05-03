"use client"

import { useNotifications } from '@/context/NotificationContext';
import { Bell } from 'lucide-react';

export default function NotificationBadge() {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground font-bold">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
}