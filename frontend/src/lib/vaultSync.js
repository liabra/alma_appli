import { useBackupStore } from '../store/useBackupStore';
import { useUserStore } from '../store/useUserStore';
import { useBebeStore } from '../store/useBebeStore';
import { useSessionStore } from '../store/useSessionStore';
import { useShareStore } from '../store/useShareStore';
import { useCarnetStore } from '../store/useCarnetStore';
import { deriveSecrets, importEncKey, encryptJSON, decryptJSON } from './vaultCrypto';
import { initVault, pullVault, pushVault, deleteVault } from './vaultClient';

const LOCAL_KEYS = ['alma_user', 'alma_bebe', 'alma_session', 'alma_share', 'alma_carnet'];

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
  // Droit à l'effacement : on supprime d'abord le coffre côté serveur, puis on oublie
  // les secrets localement. Le reset local reste prioritaire même si le DELETE échoue.
  const st = useBackupStore.getState();
  if (st.authToken) {
    try { await deleteVault(st.authToken); } catch (e) { /* le reset local reste prioritaire */ }
  }
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
  // Hydrate directement les stores en mémoire (persist réécrira un localStorage propre)
  const bb = bundle?.alma_bebe?.state;
  if (bb) useBebeStore.setState({
    bebes: Array.isArray(bb.bebes) ? bb.bebes : [],
    bebeActifId: bb.bebeActifId ?? (bb.bebes?.[0]?.id ?? null),
  });
  const uu = bundle?.alma_user?.state;
  if (uu) useUserStore.setState({ uuid: uu.uuid, locale: uu.locale || 'fr', isNewUser: false });
  const ss = bundle?.alma_session?.state;
  if (ss) useSessionStore.setState(ss);
  const sh = bundle?.alma_share?.state;
  if (sh) useShareStore.setState(sh);
  const ca = bundle?.alma_carnet?.state;
  if (ca) useCarnetStore.setState({
    entries: Array.isArray(ca.entries) ? ca.entries : [],
    prises: Array.isArray(ca.prises) ? ca.prises : [],
  });
  const st = useBackupStore.getState();
  st.setSecrets({ authToken, encKeyB64 });
  st.setEnabled(true);
  st.setSynced({ version: remote.version, at: new Date().toISOString() });
  // Le composant appelant devra recharger la page pour que les stores relisent localStorage.
}
