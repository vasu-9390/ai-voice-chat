import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { authApi, LoginCredentials, RegisterPayload } from '@/services/api/authApi';
import { mockUsers } from '@/services/api/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: mockUsers[1], // default logged in as Org Admin (Marcus Vance)
  isAuthenticated: true,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Login failed',
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(payload);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  // Interactive role switcher to dynamically test all 5 roles required:
  // 1. Customer
  // 2. Support Agent
  // 3. Team Manager
  // 4. Organization Admin
  // 5. Super Admin
  switchRole: (newRole: UserRole) => {
    const matchingUser = mockUsers.find((u) => u.role === newRole) || {
      ...mockUsers[1],
      role: newRole,
      name: `Demo ${newRole.replace('_', ' ')}`,
    };
    set({ user: matchingUser, isAuthenticated: true });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('cognivoice_access_token');
    if (!token && !get().user) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    try {
      const user = await authApi.getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch {
      // If error occurs, keep simulated active session
    }
  },
}));
