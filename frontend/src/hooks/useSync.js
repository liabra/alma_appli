import { useEffect, useRef } from "react";
import { useUserStore } from "../store/useUserStore";
import { useBebeStore } from "../store/useBebeStore";
import { useSessionStore } from "../store/useSessionStore";
import { api } from "../lib/api";

// Hook de synchronisation cloud
// Offline-first : tout tourne en local, sync quand réseau disponible
export function useSync() {
  const { uuid } = useUserStore();
  const { bebe, setBebe } = useBebeStore();
  const syncIntervalRef = useRef(null);

  const syncToCloud = async () => {
    if (!uuid || !navigator.onLine) return;
    try {
      // Init user sur le serveur
      await api.post("/auth/init", { uuid, locale: "fr" });
      // Sync bébé
      if (bebe) {
        const bebeSrv = await api.get(`/bebe/${uuid}`).catch(() => null);
        if (!bebeSrv) {
          await api.post("/bebe/", { user_uuid: uuid, prenom: bebe.prenom, date_naissance: bebe.dateNaissance, mode_alimentation: bebe.modeAlimentation });
        }
      }
    } catch (e) {
      console.log("Sync offline — will retry when online");
    }
  };

  useEffect(() => {
    if (!uuid) return;
    // Sync au démarrage
    syncToCloud();
    // Sync toutes les 5 minutes
    syncIntervalRef.current = setInterval(syncToCloud, 5 * 60 * 1000);
    // Sync au retour de connexion
    window.addEventListener("online", syncToCloud);
    return () => {
      clearInterval(syncIntervalRef.current);
      window.removeEventListener("online", syncToCloud);
    };
  }, [uuid, bebe]);

  return { syncToCloud };
}
