/**
 * Auth Store - Zustand ile kimlik doğrulama state yönetimi
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch, createMockResponse, isDevelopment } from '@/lib/fetcher';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  hydrateMe: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// Mock data for development
const mockUser: User = {
  id: '1',
  name: 'Test Kullanıcı',
  email: 'test@example.com',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  createdAt: new Date().toISOString(),
};

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      loading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ loading: true, error: null });
        
        try {
          if (isDevelopment) {
            // Mock login for development
            await createMockResponse({ user: mockUser }, 1000);
            set({ user: mockUser, loading: false });
            return;
          }

          const response = await apiFetch<AuthResponse>('/auth/login', {
            method: 'POST',
            body: credentials,
          });

          set({ user: response.user, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Giriş yapılırken bir hata oluştu';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ loading: true, error: null });
        
        try {
          if (isDevelopment) {
            // Mock register for development
            await createMockResponse({ user: mockUser }, 1000);
            set({ user: mockUser, loading: false });
            return;
          }

          const response = await apiFetch<AuthResponse>('/auth/register', {
            method: 'POST',
            body: data,
          });

          set({ user: response.user, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Kayıt olurken bir hata oluştu';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        
        try {
          if (isDevelopment) {
            // Mock logout for development
            await createMockResponse({}, 500);
            set({ user: null, loading: false });
            return;
          }

          await apiFetch('/auth/logout', {
            method: 'POST',
          });

          set({ user: null, loading: false });
        } catch (error) {
          // Logout hatası olsa bile kullanıcıyı çıkar
          set({ user: null, loading: false });
        }
      },

      hydrateMe: async () => {
        set({ loading: true, error: null });
        
        try {
          if (isDevelopment) {
            // Mock hydrate for development
            await createMockResponse({ user: mockUser }, 500);
            set({ user: mockUser, loading: false });
            return;
          }

          const response = await apiFetch<AuthResponse>('/auth/me');
          set({ user: response.user, loading: false });
        } catch (error) {
          // Hydrate hatası durumunda kullanıcıyı null yap
          set({ user: null, loading: false });
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Selectors
export const useUser = () => useAuth((state) => state.user);
export const useAuthLoading = () => useAuth((state) => state.loading);
export const useAuthError = () => useAuth((state) => state.error);
export const useIsAuthenticated = () => useAuth((state) => !!state.user);
