import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSessionStore = create(
  persist(
    (set, get) => ({
      // ─── ALIMENTATION ────────────────────────────────────────────
      tetees: [],
      modeAlimentation: "allait",

      addTetee: (tetee) =>
        set(s => ({ tetees: [...s.tetees, { ...tetee, id: Date.now() }] })),

      supprimerDerniereTetee: () =>
        set(s => ({ tetees: s.tetees.slice(0, -1) })),

      setModeAlimentation: (mode) => set({ modeAlimentation: mode }),

      getTeteesAujourdhui: () => {
        const today = new Date().toDateString();
        return get().tetees.filter(t => new Date(t.timestamp).toDateString() === today);
      },

      // ─── SOMMEIL ─────────────────────────────────────────────────
      periodesSommeil: [],
      sommeilEnCours: null,

      startSommeil: () => set({ sommeilEnCours: Date.now() }),

      stopSommeil: () => {
        const debut = get().sommeilEnCours;
        if (!debut) return;
        set(s => ({
          periodesSommeil: [...s.periodesSommeil, { id: Date.now(), debut, fin: Date.now() }],
          sommeilEnCours: null,
        }));
      },

      getPeriodeSommeilAujourdhui: () => {
        const today = new Date().toDateString();
        return get().periodesSommeil.filter(p => new Date(p.debut).toDateString() === today);
      },

      getTotalSommeilAujourdhui: () => {
        const periodes = get().getPeriodeSommeilAujourdhui();
        const totalMs = periodes.reduce((acc, p) => acc + ((p.fin || Date.now()) - p.debut), 0);
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        return h > 0 ? `${h}h${String(m).padStart(2,"0")}` : `${m} min`;
      },

      // ─── COUCHES ─────────────────────────────────────────────────
      couches: [],

      addCouche: (type) =>
        set(s => ({ couches: [...s.couches, { id: Date.now(), type, timestamp: Date.now() }] })),

      supprimerDerniereCouche: () =>
        set(s => ({ couches: s.couches.slice(0, -1) })),

      getCouchesAujourdhui: () => {
        const today = new Date().toDateString();
        return get().couches.filter(c => new Date(c.timestamp).toDateString() === today);
      },

      // ─── TEMPERATURE ─────────────────────────────────────────────
      temperatures: [],

      addTemperature: (valeur) =>
        set(s => ({ temperatures: [...s.temperatures, { id: Date.now(), valeur, timestamp: Date.now() }] })),

      getDerniereTemperature: () => {
        const { temperatures } = get();
        return temperatures.length > 0 ? temperatures[temperatures.length - 1] : null;
      },

      // ─── CHECK-INS HUMEUR ─────────────────────────────────────────
      checkins: [],

      addCheckin: (mood, texte = "") => {
        const today = new Date().toISOString().split("T")[0];
        set(s => ({
          checkins: [
            ...s.checkins.filter(c => c.date !== today),
            { date: today, mood, texte, timestamp: Date.now() }
          ]
        }));
      },

      getCheckinsDerniersDays: (n = 7) => {
        const checkins = get().checkins;
        const labels = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
        return Array.from({ length: n }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (n - 1 - i));
          const dateStr = d.toISOString().split("T")[0];
          const found = checkins.find(c => c.date === dateStr);
          return { date: labels[d.getDay()], mood: found ? found.mood : null };
        });
      },

      // ─── RÉSEAU DE SOUTIEN ────────────────────────────────────────
      alliees: [],

      addAlliee: (alliee) =>
        set(s => ({ alliees: [...s.alliees, { ...alliee, id: Date.now() }] })),

      updateAlliee: (id, data) =>
        set(s => ({ alliees: s.alliees.map(a => a.id === id ? { ...a, ...data } : a) })),

      supprimerAlliee: (id) =>
        set(s => ({ alliees: s.alliees.filter(a => a.id !== id) })),

      // ─── DASHBOARD CONFIG ─────────────────────────────────────────
      widgetOrder: ["alimentation", "soutien", "couches", "sommeil", "sante"],
      hiddenWidgets: [],

      setWidgetOrder: (order) => set({ widgetOrder: order }),

      toggleHideWidget: (id) =>
        set(s => ({
          hiddenWidgets: s.hiddenWidgets.includes(id)
            ? s.hiddenWidgets.filter(x => x !== id)
            : [...s.hiddenWidgets, id],
        })),

      // ─── WIDGETS SECTIONS CACHABLES ───────────────────────────────
      // Pour cacher les signaux allaitement, les couches, la température
      sectionsCache: [],

      toggleSectionCachee: (section) =>
        set(s => ({
          sectionsCache: s.sectionsCache.includes(section)
            ? s.sectionsCache.filter(x => x !== section)
            : [...s.sectionsCache, section],
        })),

      isSectionCachee: (section) => get().sectionsCache.includes(section),
    }),
    {
      name: "alma_session",
      // Persiste TOUT
      partialize: (state) => ({
        tetees: state.tetees,
        modeAlimentation: state.modeAlimentation,
        periodesSommeil: state.periodesSommeil,
        sommeilEnCours: state.sommeilEnCours,
        couches: state.couches,
        temperatures: state.temperatures,
        checkins: state.checkins,
        alliees: state.alliees,
        widgetOrder: state.widgetOrder,
        hiddenWidgets: state.hiddenWidgets,
        sectionsCache: state.sectionsCache,
      }),
    }
  )
);
