import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppState = {
  initialized: boolean;
  setInitialized: (v: boolean) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      initialized: false,
      setInitialized: (v) => set({ initialized: v }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);


