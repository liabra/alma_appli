import { useEffect, useRef, useCallback } from "react";
import { useUserStore } from "../store/useUserStore";
import { useBebeStore } from "../store/useBebeStore";
import { useSessionStore } from "../store/useSessionStore";
import { api } from "../lib/api";

const SYNC_INTERVAL = 2 * 60 * 1000; // 2 minutes

export function useSync() {
  const { uuid } = useUserStore();
  const bebeStore = useBebeStore();
  const sessionStore = useSessionStore();
  const syncIntervalRef = useRef(null);
  const lastSyncRef = useRef(null);

  const pushToCloud = useCallback(async () => {
    if (!uuid || !navigator.onLine) return;
    try {
      // Init user si nécessaire
      await api.post("/auth/init", { uuid, locale: "fr" }).catch(() => {});

      // Sérialiser l'état complet
      const data = {
        bebes: bebeStore.bebes,
        bebeActifId: bebeStore.bebeActifId,
        session: {
          tetees: sessionStore.tetees,
          modeAlimentation: sessionStore.modeAlimentation,
          periodesSommeil: sessionStore.periodesSommeil,
          sommeilEnCours: sessionStore.sommeilEnCours,
          couches: sessionStore.couches,
          temperatures: sessionStore.temperatures,
          checkins: sessionStore.checkins,
          alliees: sessionStore.alliees,
          widgetOrder: sessionStore.widgetOrder,
          hiddenWidgets: sessionStore.hiddenWidgets,
          sectionsCache: sessionStore.sectionsCache,
        },
        syncedAt: new Date().toISOString(),
      };

      await api.post("/sync/push", { uuid, data });
      lastSyncRef.current = new Date();
    } catch (e) {
      // Silencieux — offline-first
    }
  }, [uuid, bebeStore, sessionStore]);

  // Sync au démarrage
  useEffect(() => {
    if (!uuid) return;
    pushToCloud();
    syncIntervalRef.current = setInterval(pushToCloud, SYNC_INTERVAL);
    window.addEventListener("online", pushToCloud);
    // Sync avant de quitter la page
    window.addEventListener("beforeunload", pushToCloud);
    return () => {
      clearInterval(syncIntervalRef.current);
      window.removeEventListener("online", pushToCloud);
      window.removeEventListener("beforeunload", pushToCloud);
    };
  }, [uuid, pushToCloud]);

  return { pushToCloud, lastSync: lastSyncRef.current };
}

// Fonction de restauration depuis un code de récupération
export async function restoreFromCode(code) {
  try {
    const result = await api.post("/sync/recovery/restore", { recovery_code: code });
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: "Code invalide ou introuvable" };
  }
}

// Générer le code de récupération
export async function generateRecoveryCode(uuid) {
  try {
    const result = await api.post(`/sync/recovery/generate?uuid=${uuid}`, {});
    return result.code;
  } catch (e) {
    return null;
  }
}
