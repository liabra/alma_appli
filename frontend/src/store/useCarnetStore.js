import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultEntry = {
  type: "observation",
  pour: "bebe",
  titre: "",
  note: "",
  // médicament (tous optionnels)
  dosage: "",
  forme: "",
  voie: "",
  prescritPar: "",
  // suivi
  suiviActif: false,
  moments: [],
  dateDebut: null,
  dateFin: null,
  // rdv
  dateRdv: null,
  lieu: "",
  // observation
  resolu: false,
  archived: false,
};

export const useCarnetStore = create(
  persist(
    (set, get) => ({
      entries: [],   // les entrées du carnet
      prises: [],    // journal des prises cochées (suivi actif)

      addEntry: (partial) => {
        const now = Date.now();
        const entry = { ...defaultEntry, ...partial, id: now, createdAt: now };
        set(s => ({ entries: [...s.entries, entry] }));
        return entry;
      },

      updateEntry: (id, patch) =>
        set(s => ({
          entries: s.entries.map(e => e.id === id ? { ...e, ...patch } : e),
        })),

      removeEntry: (id) =>
        set(s => ({
          entries: s.entries.filter(e => e.id !== id),
          prises: s.prises.filter(pr => pr.entryId !== id),
        })),

      archiveEntry: (id, bool) =>
        set(s => ({
          entries: s.entries.map(e => e.id === id ? { ...e, archived: bool } : e),
        })),

      toggleSuivi: (id) =>
        set(s => ({
          entries: s.entries.map(e => e.id === id ? { ...e, suiviActif: !e.suiviActif } : e),
        })),

      togglePrise: (entryId, moment, dateStr) =>
        set(s => {
          const existe = s.prises.find(
            pr => pr.entryId === entryId && pr.moment === moment && pr.date === dateStr
          );
          if (existe) {
            return { prises: s.prises.filter(pr => pr.id !== existe.id) };
          }
          const now = Date.now();
          return {
            prises: [...s.prises, { id: now, entryId, moment, date: dateStr, at: now }],
          };
        }),

      getEntriesActives: () => get().entries.filter(e => !e.archived),

      getPriseFaite: (entryId, moment, dateStr) =>
        get().prises.some(
          pr => pr.entryId === entryId && pr.moment === moment && pr.date === dateStr
        ),

      getPrisesDuJour: (dateStr) => get().prises.filter(pr => pr.date === dateStr),
    }),
    {
      name: "alma_carnet",
      partialize: (state) => ({
        entries: state.entries,
        prises: state.prises,
      }),
    }
  )
);
