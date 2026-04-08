import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBebeStore = create(
  persist(
    (set, get) => ({
      bebe: null, // { id, prenom, dateNaissance, modeAlimentation }

      setBebe: (bebe) => set({ bebe }),

      // Calcule l'âge en jours
      getAgeDays: () => {
        const { bebe } = get();
        if (!bebe?.dateNaissance) return null;
        const diff = Date.now() - new Date(bebe.dateNaissance).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
      },

      // Calcule l'âge formaté lisible
      getAgeLabel: () => {
        const days = get().getAgeDays();
        if (days === null) return "";
        if (days < 7) return `${days} jour${days > 1 ? "s" : ""}`;
        const weeks = Math.floor(days / 7);
        const remDays = days % 7;
        if (weeks < 8) return remDays > 0 ? `${weeks} sem. et ${remDays} j.` : `${weeks} semaine${weeks > 1 ? "s" : ""}`;
        const months = Math.floor(days / 30);
        return `${months} mois`;
      },

      // Fenêtre de sommeil selon l'âge (en minutes d'éveil max)
      getEveilMaxMinutes: () => {
        const days = get().getAgeDays();
        if (days === null) return 60;
        if (days < 14) return 45;
        if (days < 30) return 55;
        if (days < 60) return 75;
        if (days < 90) return 90;
        return 120;
      },
    }),
    { name: "alma_bebe" }
  )
);
