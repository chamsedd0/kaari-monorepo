import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  userId?: string;
  role?: 'advertiser' | 'client';
  setUser: (s: { userId: string; role: 'advertiser' | 'client' }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: undefined,
      role: undefined,
      setUser: ({ userId, role }) => set({ userId, role }),
      clearSession: () => set({ userId: undefined, role: undefined }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);


