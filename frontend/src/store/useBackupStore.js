import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBackupStore = create(
  persist(
    (set) => ({
      enabled: false,
      authToken: null,
      encKeyB64: null,
      lastVersion: null,
      lastSyncedAt: null,
      lastError: null,
      setEnabled: (v) => set({ enabled: v }),
      setSecrets: ({ authToken, encKeyB64 }) => set({ authToken, encKeyB64 }),
      setSynced: ({ version, at }) => set({ lastVersion: version, lastSyncedAt: at }),
      setError: (e) => set({ lastError: e }),
      reset: () => set({ enabled: false, authToken: null, encKeyB64: null, lastVersion: null, lastSyncedAt: null, lastError: null }),
    }),
    { name: 'alma_backup' }
  )
);
