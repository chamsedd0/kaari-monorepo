import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  token?: string;
  userId?: string;
  setSession: (s: { token: string; userId: string }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      userId: undefined,
      setSession: ({ token, userId }) => set({ token, userId }),
      clearSession: () => set({ token: undefined, userId: undefined }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);


