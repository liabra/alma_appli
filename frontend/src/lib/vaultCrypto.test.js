import { describe, it, expect } from 'vitest';
import { webcrypto } from 'node:crypto';
if (!globalThis.crypto) globalThis.crypto = webcrypto;
import {
  generateRecoveryPhrase, isValidRecoveryPhrase,
  deriveSecrets, encryptJSON, decryptJSON,
} from './vaultCrypto.js';

describe('vaultCrypto', () => {
  it('génère 12 mots français valides', () => {
    const p = generateRecoveryPhrase();
    expect(p.split(' ').length).toBe(12);
    expect(isValidRecoveryPhrase(p)).toBe(true);
    expect(isValidRecoveryPhrase('mot invalide xyz')).toBe(false);
  });
  it('dérive un authToken déterministe et différent selon la phrase', async () => {
    const p1 = generateRecoveryPhrase();
    const p2 = generateRecoveryPhrase();
    const a1 = await deriveSecrets(p1);
    const a1bis = await deriveSecrets(p1);
    const a2 = await deriveSecrets(p2);
    expect(a1.authToken).toBe(a1bis.authToken);
    expect(a1.authToken).not.toBe(a2.authToken);
  });
  it('chiffre puis déchiffre un objet (aller-retour)', async () => {
    const { encKey } = await deriveSecrets(generateRecoveryPhrase());
    const obj = { tetees: [1, 2, 3], note: 'éàü', n: 42 };
    const blob = await encryptJSON(obj, encKey);
    expect(typeof blob).toBe('string');
    expect(await decryptJSON(blob, encKey)).toEqual(obj);
  });
  it('refuse de déchiffrer avec une mauvaise clé', async () => {
    const a = await deriveSecrets(generateRecoveryPhrase());
    const b = await deriveSecrets(generateRecoveryPhrase());
    const blob = await encryptJSON({ x: 1 }, a.encKey);
    await expect(decryptJSON(blob, b.encKey)).rejects.toBeTruthy();
  });
});
