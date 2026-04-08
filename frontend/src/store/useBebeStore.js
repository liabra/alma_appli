import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBebeStore = create(
  persist(
    (set, get) => ({
      bebe: null,

      setBebe: (bebe) => set({ bebe }),

      getAgeDays: () => {
        const { bebe } = get();
        if (!bebe?.dateNaissance) return null;
        const diff = Date.now() - new Date(bebe.dateNaissance).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
      },

      getAgeLabel: () => {
        const days = get().getAgeDays();
        if (days === null) return "";
        if (days < 7) return `${days} jour${days > 1 ? "s" : ""}`;
        const weeks = Math.floor(days / 7);
        const remDays = days % 7;
        if (weeks < 8) return remDays > 0 ? `${weeks} sem. et ${remDays} j.` : `${weeks} semaine${weeks > 1 ? "s" : ""}`;
        const months = Math.floor(days / 30);
        if (months < 24) return `${months} mois`;
        const years = Math.floor(months / 12);
        const remMonths = months % 12;
        return remMonths > 0 ? `${years} an${years > 1 ? "s" : ""} et ${remMonths} mois` : `${years} an${years > 1 ? "s" : ""}`;
      },

      // Fenêtre de sommeil adaptée à l'âge
      getEveilMaxMinutes: () => {
        const days = get().getAgeDays();
        if (days === null) return 60;
        if (days < 14)  return 45;   // 0-2 semaines
        if (days < 30)  return 55;   // 2-4 semaines
        if (days < 60)  return 75;   // 1-2 mois
        if (days < 90)  return 90;   // 2-3 mois
        if (days < 120) return 105;  // 3-4 mois
        if (days < 180) return 120;  // 4-6 mois
        if (days < 270) return 150;  // 6-9 mois
        if (days < 365) return 180;  // 9-12 mois
        if (days < 540) return 240;  // 12-18 mois
        return 300;                   // 18 mois+
      },
    }),
    { name: "alma_bebe" }
  )
);
