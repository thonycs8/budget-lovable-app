import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Estado de autenticação
 */
interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Ações de autenticação
 */
interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
  reset: () => void;
}

/**
 * Store Zustand para autenticação
 * 
 * Características:
 * - Persistência em localStorage
 * - Estado sincronizado com Supabase
 * - Tipo-safe com TypeScript
 */
const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setSession: (session) =>
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
          isLoading: false,
        }),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      signOut: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      reset: () =>
        set(initialState),
    }),
    {
      name: 'gestfin-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Apenas persistir dados essenciais
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Seletores otimizados para evitar re-renders desnecessários
 */
export const authSelectors = {
  user: (state: AuthState & AuthActions) => state.user,
  session: (state: AuthState & AuthActions) => state.session,
  isAuthenticated: (state: AuthState & AuthActions) => state.isAuthenticated,
  isLoading: (state: AuthState & AuthActions) => state.isLoading,
  userId: (state: AuthState & AuthActions) => state.user?.id,
  userEmail: (state: AuthState & AuthActions) => state.user?.email,
};
