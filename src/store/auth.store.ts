import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isHydrated: false,
      setHydrated: (state) => set({ isHydrated: state }),
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
