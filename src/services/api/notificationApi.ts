import { apiClient } from './client';
import { AppNotification } from '@/types';
import { mockNotifications } from './mockData';

let notifsStore = [...mockNotifications];

export const notificationApi = {
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const { data } = await apiClient.get<AppNotification[]>('/notifications');
      return data;
    } catch {
      return [...notifsStore];
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch {
      notifsStore = notifsStore.map((n) => (n.id === id ? { ...n, read: true } : n));
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.post('/notifications/mark-all-read');
    } catch {
      notifsStore = notifsStore.map((n) => ({ ...n, read: true }));
    }
  },
};
