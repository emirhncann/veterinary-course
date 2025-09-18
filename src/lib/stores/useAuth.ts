/**
 * Auth Store - Zustand ile kimlik doğrulama state yönetimi
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '@/lib/fetcher';
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

// Mock data kaldırıldı - artık sadece gerçek API kullanılıyor

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
          console.log('🔐 API call to /login with credentials:', credentials);
          const response = await apiFetch<{ status: string; message: string; user: User }>('/login', {
            method: 'POST',
            body: credentials,
          });

          console.log('🔐 API response:', response);

          if (response.status === 'success') {
            console.log('🔐 Giriş başarılı! Kullanıcı bilgileri:', response.user);
            set({ user: response.user, loading: false });
          } else {
            console.error('❌ Login failed with status:', response.status, 'message:', response.message);
            throw new Error(response.message || 'Giriş başarısız');
          }
        } catch (error) {
          console.error('❌ Login API error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Giriş yapılırken bir hata oluştu';
          console.error('❌ Final error message:', errorMessage);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiFetch<{ status: string; message: string; user: User }>('/register', {
            method: 'POST',
            body: data,
          });

          if (response.status === 'success') {
            console.log('📝 Kayıt başarılı! Kullanıcı bilgileri:', response.user);
            set({ user: response.user, loading: false });
          } else {
            throw new Error(response.message || 'Kayıt başarısız');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Kayıt olurken bir hata oluştu';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        
        try {
          await apiFetch('/logout', {
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
          const response = await apiFetch<{ status: string; user: User }>('/me');
          if (response.status === 'success') {
            set({ user: response.user, loading: false });
          } else {
            set({ user: null, loading: false });
          }
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
