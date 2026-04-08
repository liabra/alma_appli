import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export const useUserStore = create(
  persist(
    (set, get) => ({
      uuid: null,
      locale: "fr",
      isNewUser: true,
      isPaid: false,

      // Initialise ou récupère l'UUID anonyme
      initUser: () => {
        if (!get().uuid) {
          set({ uuid: uuidv4() });
        }
      },

      setIsPaid: (val) => set({ isPaid: val }),
      setIsNewUser: (val) => set({ isNewUser: val }),
    }),
    { name: "alma_user" }
  )
);
