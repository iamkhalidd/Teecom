import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface Notification {
  id: number;
  recipient: number;
  sender: number | null;
  notification_type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  is_archived: boolean;
  related_object_id: number | null;
  related_object_type: string | null;
  action_url: string | null;
  action_label: string | null;
  created_at: string;
  updated_at: string;
  time_since?: string;
}

interface NotificationPreferences {
  email_order_updates: boolean;
  email_messages: boolean;
  email_promotions: boolean;
  email_system: boolean;
  email_support_reply: boolean;
  email_payment_updates: boolean;
  email_shipping_updates: boolean;
  in_app_order_updates: boolean;
  in_app_messages: boolean;
  in_app_promotions: boolean;
  in_app_system: boolean;
  in_app_support_reply: boolean;
  in_app_payment_updates: boolean;
  in_app_shipping_updates: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  fetchPreferences: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAsUnread: (id: number) => Promise<void>;
  archive: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearRead: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.notifications.list();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await api.admin.notifications.unreadCount();
      setUnreadCount(data.unread_count);
    } catch (err: any) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  const fetchPreferences = useCallback(async () => {
    try {
      const data = await api.admin.notifications.preferences.get();
      setPreferences(data);
    } catch (err: any) {
      // Preferences might not exist yet, that's OK
      setPreferences(null);
      console.log('No preferences found, will create on first update');
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await api.admin.notifications.markAsRead(id);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      setError(err.message || 'Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
    }
  }, []);

  const markAsUnread = useCallback(async (id: number) => {
    try {
      await api.admin.notifications.markAsUnread(id);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: false } : n)
      );
      setUnreadCount(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || 'Failed to mark notification as unread');
      console.error('Error marking notification as unread:', err);
    }
  }, []);

  const archive = useCallback(async (id: number) => {
    try {
      await api.admin.notifications.archive(id);
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === id);
        return notification && !notification.is_read ? prev - 1 : prev;
      });
    } catch (err: any) {
      setError(err.message || 'Failed to archive notification');
      console.error('Error archiving notification:', err);
    }
  }, [notifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.admin.notifications.markAllAsRead();
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message || 'Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  const clearRead = useCallback(async () => {
    try {
      await api.admin.notifications.clearRead();
      // Update local state
      setNotifications(prev => prev.filter(n => !n.is_read));
      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message || 'Failed to clear read notifications');
      console.error('Error clearing read notifications:', err);
    }
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<NotificationPreferences>) => {
    try {
      let response;
      if (preferences) {
        response = await api.admin.notifications.preferences.partialUpdate({ ...preferences, ...updates });
      } else {
        response = await api.admin.notifications.preferences.update({ ...updates });
      }
      setPreferences(response);
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
      console.error('Error updating preferences:', err);
    }
  }, [preferences]);

  // Fetch data on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    fetchPreferences();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount, fetchPreferences]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      preferences,
      loading,
      error,
      fetchNotifications,
      fetchUnreadCount,
      fetchPreferences,
      markAsRead,
      markAsUnread,
      archive,
      markAllAsRead,
      clearRead,
      updatePreferences,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};