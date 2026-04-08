import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBebeStore = create(
  persist(
    (set, get) => ({
      bebes: [],        // liste de tous les bébés
      bebeActifId: null, // id du bébé affiché

      // Bébé actif
      getBebe: () => {
        const { bebes, bebeActifId } = get();
        return bebes.find(b => b.id === bebeActifId) || bebes[0] || null;
      },

      // Compatibilité ancienne API (bebe unique)
      get bebe() { return get().getBebe(); },

      ajouterBebe: (data) => {
        const nouveau = { ...data, id: Date.now() };
        set(s => ({
          bebes: [...s.bebes, nouveau],
          bebeActifId: nouveau.id,
        }));
        return nouveau;
      },

      setBebe: (data) => {
        // Compatibilité : si un seul bébé existant, on le met à jour
        const { bebes } = get();
        if (bebes.length === 0) {
          const nouveau = { ...data, id: Date.now() };
          set({ bebes: [nouveau], bebeActifId: nouveau.id });
        } else {
          const id = get().bebeActifId || bebes[0].id;
          set(s => ({ bebes: s.bebes.map(b => b.id === id ? { ...b, ...data } : b) }));
        }
      },

      setBebeActif: (id) => set({ bebeActifId: id }),

      supprimerBebe: (id) => {
        set(s => {
          const restants = s.bebes.filter(b => b.id !== id);
          return { bebes: restants, bebeActifId: restants[0]?.id || null };
        });
      },

      // Accord grammatical selon le sexe
      accord: (féminin, masculin) => {
        const bebe = get().getBebe();
        return bebe?.sexe === "fille" ? féminin : masculin;
      },

      // Prénom du bébé actif
      getPrenom: () => get().getBebe()?.prenom || "Bébé",

      getAgeDays: () => {
        const bebe = get().getBebe();
        if (!bebe?.dateNaissance) return null;
        return Math.floor((Date.now() - new Date(bebe.dateNaissance).getTime()) / 86400000);
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

      getEveilMaxMinutes: () => {
        const days = get().getAgeDays();
        if (days === null) return 60;
        if (days < 14)  return 45;
        if (days < 30)  return 55;
        if (days < 60)  return 75;
        if (days < 90)  return 90;
        if (days < 120) return 105;
        if (days < 180) return 120;
        if (days < 270) return 150;
        if (days < 365) return 180;
        if (days < 540) return 240;
        return 300;
      },
    }),
    { name: "alma_bebe" }
  )
);
