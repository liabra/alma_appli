import { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useBebeStore } from '../store/useBebeStore';
import { useSessionStore } from '../store/useSessionStore';
import { useShareStore } from '../store/useShareStore';
import { useBackupStore } from '../store/useBackupStore';
import { pushNow } from '../lib/vaultSync';

const DEBOUNCE_MS = 8000;

export function useBackupSync() {
  useEffect(() => {
    let timer = null;
    const schedule = () => {
      if (!useBackupStore.getState().enabled) return;
      clearTimeout(timer);
      timer = setTimeout(() => { pushNow(); }, DEBOUNCE_MS);
    };
    const unsubs = [
      useUserStore.subscribe(schedule),
      useBebeStore.subscribe(schedule),
      useSessionStore.subscribe(schedule),
      useShareStore.subscribe(schedule),
    ];
    const onOnline = () => { if (useBackupStore.getState().enabled) pushNow(); };
    window.addEventListener('online', onOnline);
    return () => {
      clearTimeout(timer);
      unsubs.forEach((u) => u && u());
      window.removeEventListener('online', onOnline);
    };
  }, []);
}
