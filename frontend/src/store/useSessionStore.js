import { create } from "zustand";
import { persist } from "zustand/middleware";

// State de session : tétées, sommeil, couches du jour
// Persisté en localStorage pour offline-first

export const useSessionStore = create(
  persist(
    (set, get) => ({
      // Alimentation
      tetees: [], // [{ id, debut, fin, sein, ml, signaux, timestamp }]
      modeAlimentation: "allait", // allait | biberon | mixte

      addTetee: (tetee) =>
        set((s) => ({ tetees: [...s.tetees, { ...tetee, id: Date.now() }] })),
      setModeAlimentation: (mode) => set({ modeAlimentation: mode }),

      getTeteesAujourdhui: () => {
        const today = new Date().toDateString();
        return get().tetees.filter(
          (t) => new Date(t.timestamp).toDateString() === today
        );
      },

      // Sommeil
      periodesSommeil: [], // [{ id, debut, fin }]
      sommeilEnCours: null, // timestamp debut si dort

      startSommeil: () => set({ sommeilEnCours: Date.now() }),
      stopSommeil: () => {
        const debut = get().sommeilEnCours;
        if (!debut) return;
        set((s) => ({
          periodesSommeil: [
            ...s.periodesSommeil,
            { id: Date.now(), debut, fin: Date.now() },
          ],
          sommeilEnCours: null,
        }));
      },

      getPeriodeSommeilAujourdhui: () => {
        const today = new Date().toDateString();
        return get().periodesSommeil.filter(
          (p) => new Date(p.debut).toDateString() === today
        );
      },

      getTotalSommeilAujourdhui: () => {
        const periodes = get().getPeriodeSommeilAujourdhui();
        const totalMs = periodes.reduce((acc, p) => acc + (p.fin - p.debut), 0);
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`;
      },

      // Couches
      couches: [], // [{ id, type, timestamp }]
      addCouche: (type) =>
        set((s) => ({
          couches: [
            ...s.couches,
            { id: Date.now(), type, timestamp: Date.now() },
          ],
        })),

      getCouchesAujourdhui: () => {
        const today = new Date().toDateString();
        return get().couches.filter(
          (c) => new Date(c.timestamp).toDateString() === today
        );
      },

      // Check-ins humeur
      checkins: [], // [{ date: 'YYYY-MM-DD', mood: 0-4, texte: '' }]
      addCheckin: (mood, texte = "") => {
        const today = new Date().toISOString().split("T")[0];
        set((s) => ({
          checkins: [
            ...s.checkins.filter(c => c.date !== today), // 1 seul par jour
            { date: today, mood, texte, timestamp: Date.now() }
          ]
        }));
      },
      getCheckinsDerniersDays: (n = 7) => {
        const checkins = get().checkins;
        return Array.from({ length: n }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (n - 1 - i));
          const dateStr = d.toISOString().split("T")[0];
          const found = checkins.find(c => c.date === dateStr);
          const labels = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
          return { date: labels[d.getDay()], mood: found ? found.mood : null };
        });
      },

      // Dashboard config
      widgetOrder: ["alimentation", "soutien", "couches", "sommeil", "sante"],
      hiddenWidgets: [],
      setWidgetOrder: (order) => set({ widgetOrder: order }),
      toggleHideWidget: (id) =>
        set((s) => ({
          hiddenWidgets: s.hiddenWidgets.includes(id)
            ? s.hiddenWidgets.filter((x) => x !== id)
            : [...s.hiddenWidgets, id],
        })),
    }),
    { name: "alma_session" }
  )
);
