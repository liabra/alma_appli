import { create } from "zustand";
import { persist } from "zustand/middleware";

// Génère un code de partage à 6 chiffres
const genCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const useShareStore = create(
  persist(
    (set, get) => ({
      shareCode: null,
      partnerUuid: null,
      isSharing: false,

      generateCode: () => {
        const code = genCode();
        set({ shareCode: code });
        return code;
      },

      linkPartner: (partnerUuid) => set({ partnerUuid, isSharing: true }),
      unlink: () => set({ partnerUuid: null, isSharing: false, shareCode: null }),
    }),
    { name: "alma_share" }
  )
);
