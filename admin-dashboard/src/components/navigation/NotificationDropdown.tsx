"use client"

import { useNotifications } from '@/context/NotificationContext';
import { Bell, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NotificationDropdown() {
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  if (loading && notifications.length === 0) {
    return <NotificationBadge />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 hover:bg-secondary rounded-full p-2 transition-colors"
      >
        <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-64 bg-white border border-border/50 rounded-xl shadow-lg shadow-black/[0.1] z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <h3 className="text-sm font-semibold text-foreground">Notifications ({unreadCount})</h3>
            <button
              onClick={async () => {
                await markAllAsRead();
                setIsOpen(false);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all as read
            </button>
          </div>

          {error && (
            <div className="px-4 py-3 text-sm text-destructive border-b border-border/50">
              {error}
            </div>
          )}

          {notifications.length === 0 && !error && (
            <div className="px-4 py-6 text-center text-muted-foreground">
              No notifications
            </div>
          )}

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-border/50 hover:bg-secondary/50 transition-colors ${
                  !notification.is_read ? 'font-medium bg-secondary/10' : ''
                }`}
                onClick={() => {
                  if (notification.action_url) {
                    // In a real app, you might navigate here
                    // For now, we'll just mark as read
                    markAsRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8">
                    {/* Notification icon based on type */}
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <h4 className={`text-sm font-semibold text-foreground ${
                        !notification.is_read ? '' : 'line-through'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {notification.time_since || 'Just now'}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.action_url && notification.action_label && (
                      <div className="mt-1">
                        <Link
                          href={notification.action_url}
                          className="text-sm text-primary hover:underline"
                        >
                          {notification.action_label}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-border/50">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-left text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Keep the simple badge for backwards compatibility
function NotificationBadge() {
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