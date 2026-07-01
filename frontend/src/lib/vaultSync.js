import { useBackupStore } from '../store/useBackupStore';
import { deriveSecrets, importEncKey, encryptJSON, decryptJSON } from './vaultCrypto';
import { initVault, pullVault, pushVault } from './vaultClient';

const LOCAL_KEYS = ['alma_user', 'alma_bebe', 'alma_session', 'alma_share'];

export function bundleLocalData() {
  const out = {};
  for (const k of LOCAL_KEYS) {
    const raw = localStorage.getItem(k);
    out[k] = raw ? JSON.parse(raw) : null;
  }
  return out;
}

export function applyBundle(bundle) {
  for (const k of LOCAL_KEYS) {
    if (bundle && bundle[k] != null) localStorage.setItem(k, JSON.stringify(bundle[k]));
  }
}

let _inFlight = false;
export async function pushNow() {
  const s = useBackupStore.getState();
  if (!s.enabled || !s.authToken || !s.encKeyB64) return;
  if (_inFlight) return;
  _inFlight = true;
  try {
    const encKey = await importEncKey(s.encKeyB64);
    const blob = await encryptJSON(bundleLocalData(), encKey);
    const res = await pushVault(s.authToken, blob); // last-write-wins (pas de base_version)
    useBackupStore.getState().setSynced({ version: res.version, at: new Date().toISOString() });
    useBackupStore.getState().setError(null);
  } catch (e) {
    useBackupStore.getState().setError(String(e?.message || e));
  } finally {
    _inFlight = false;
  }
}

export async function enableBackup(phrase) {
  const { authToken, encKeyB64 } = await deriveSecrets(phrase);
  await initVault(authToken);
  const st = useBackupStore.getState();
  st.setSecrets({ authToken, encKeyB64 });
  st.setEnabled(true);
  await pushNow();
}

export async function disableBackup() {
  // Option 1 : on arrête et on oublie les secrets localement.
  // (Effacement du coffre côté serveur : à ajouter plus tard via un endpoint DELETE.)
  useBackupStore.getState().reset();
}

export async function restoreFromPhrase(phrase) {
  const { authToken, encKeyB64 } = await deriveSecrets(phrase);
  const remote = await pullVault(authToken);
  if (!remote || !remote.blob) throw new Error('Aucune sauvegarde trouvée pour cette phrase');
  const encKey = await importEncKey(encKeyB64);
  const bundle = await decryptJSON(remote.blob, encKey);
  applyBundle(bundle);
  // Garantit un bebeActifId cohérent dans alma_bebe (sinon getBebe peut renvoyer null)
  try {
    const raw = localStorage.getItem('alma_bebe');
    if (raw) {
      const parsed = JSON.parse(raw);
      const state = parsed?.state;
      if (state && Array.isArray(state.bebes) && state.bebes.length > 0) {
        const exists = state.bebes.some((b) => String(b.id) === String(state.bebeActifId));
        if (!exists) {
          state.bebeActifId = state.bebes[0].id;
          localStorage.setItem('alma_bebe', JSON.stringify(parsed));
        }
      }
    }
  } catch {
    // structure inattendue : on n'altère rien
  }
  const st = useBackupStore.getState();
  st.setSecrets({ authToken, encKeyB64 });
  st.setEnabled(true);
  st.setSynced({ version: remote.version, at: new Date().toISOString() });
  // Le composant appelant devra recharger la page pour que les stores relisent localStorage.
}

export async function debugInspectVault() {
  const s = useBackupStore.getState();
  if (!s.enabled || !s.authToken || !s.encKeyB64) { console.log("Sauvegarde non activée sur cet appareil"); return; }
  const remote = await pullVault(s.authToken);
  if (!remote || !remote.blob) { console.log("Coffre vide ou inexistant"); return; }
  const encKey = await importEncKey(s.encKeyB64);
  const bundle = await decryptJSON(remote.blob, encKey);
  const bebes = bundle?.alma_bebe?.state?.bebes;
  console.log("VAULT CONTENT:", {
    version: remote.version,
    alma_bebe_bebesLen: Array.isArray(bebes) ? bebes.length : "absent",
    alma_user_isNewUser: bundle?.alma_user?.state?.isNewUser,
    alma_user_uuid: bundle?.alma_user?.state?.uuid,
    keys: Object.keys(bundle || {}),
  });
  return bundle;
}
