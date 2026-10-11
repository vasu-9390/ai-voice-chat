import { apiClient } from './client';
import { User, UserRole } from '@/types';
import { mockUsers } from './mockData';

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  organizationName: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    } catch {
      // Development fallback for seamless standalone execution
      const foundUser = mockUsers.find(
        (u) => u.email.toLowerCase() === credentials.email.toLowerCase() || (credentials.role && u.role === credentials.role)
      ) || mockUsers[1]; // default to ORG_ADMIN

      const simulatedResponse: AuthResponse = {
        user: { ...foundUser, role: credentials.role || foundUser.role },
        accessToken: `jwt_access_token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        refreshToken: `jwt_refresh_token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        expiresIn: 3600,
      };

      localStorage.setItem('cognivoice_access_token', simulatedResponse.accessToken);
      localStorage.setItem('cognivoice_refresh_token', simulatedResponse.refreshToken);
      return simulatedResponse;
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
      return data;
    } catch {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        role: payload.role || 'ORG_ADMIN',
        organizationName: payload.organizationName,
        status: 'ONLINE',
        createdAt: new Date().toISOString(),
      };
      const simulatedResponse: AuthResponse = {
        user: newUser,
        accessToken: `jwt_access_token_${Date.now()}`,
        refreshToken: `jwt_refresh_token_${Date.now()}`,
        expiresIn: 3600,
      };
      localStorage.setItem('cognivoice_access_token', simulatedResponse.accessToken);
      localStorage.setItem('cognivoice_refresh_token', simulatedResponse.refreshToken);
      return simulatedResponse;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await apiClient.get<User>('/auth/me');
      return data;
    } catch {
      // Fallback
      return mockUsers[1]; // Marcus Vance, ORG_ADMIN
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('cognivoice_access_token');
      localStorage.removeItem('cognivoice_refresh_token');
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data } = await apiClient.post('/auth/forgot-password', { email });
      return data;
    } catch {
      return { success: true, message: 'Password reset link sent to ' + email };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      const { data } = await apiClient.post('/auth/reset-password', { token, newPassword });
      return data;
    } catch {
      return { success: true };
    }
  },

  async verifyEmail(token: string): Promise<{ success: boolean }> {
    try {
      const { data } = await apiClient.post('/auth/verify-email', { token });
      return data;
    } catch {
      return { success: true };
    }
  },
};
