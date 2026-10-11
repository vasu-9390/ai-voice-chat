import { create } from 'zustand';
import { AppNotification } from '@/types';
import { notificationApi } from '@/services/api/notificationApi';
import { mockNotifications } from '@/services/api/mockData';

interface NotificationState {
  notifications: AppNotification[];
  isOpen: boolean;
  filter: 'all' | 'unread';
  soundEnabled: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setIsOpen: (isOpen: boolean) => void;
  setFilter: (filter: 'all' | 'unread') => void;
  toggleSound: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  isOpen: false,
  filter: 'all',
  soundEnabled: true,

  fetchNotifications: async () => {
    try {
      const data = await notificationApi.getNotifications();
      set({ notifications: data });
    } catch {
      // Keep state
    }
  },

  markAsRead: async (id: string) => {
    await notificationApi.markAsRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  markAllAsRead: async () => {
    await notificationApi.markAllAsRead();
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setFilter: (filter: 'all' | 'unread') => set({ filter }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  addNotification: (notif) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));

    // Trigger audio ping if enabled
    if (get().soundEnabled && typeof window !== 'undefined' && window.AudioContext) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch {
        // audio blocked or unavailable
      }
    }
  },
}));
