import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export const useUserStore = create(
  persist(
    (set, get) => ({
      uuid: null,
      locale: "fr",
      isNewUser: true,
      hasHydrated: false,

      // Initialise ou récupère l'UUID anonyme
      initUser: () => {
        if (!get().uuid) {
          set({ uuid: uuidv4() });
        }
      },

      setIsNewUser: (val) => set({ isNewUser: val }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "alma_user",
      onRehydrateStorage: () => (state) => { state?.setHasHydrated(true); },
    }
  )
);
