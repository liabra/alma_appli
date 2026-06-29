import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/french.js';

const ENC = new TextEncoder();
const DEC = new TextDecoder();
const HKDF_SALT = ENC.encode('alma-vault-2026');

export function generateRecoveryPhrase() {
  return generateMnemonic(wordlist, 128); // 12 mots français
}

export function isValidRecoveryPhrase(phrase) {
  return validateMnemonic((phrase || '').trim().toLowerCase(), wordlist);
}

function toB64(bytes) {
  let s = ''; const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  }
  return btoa(s);
}
function fromB64(str) { return Uint8Array.from(atob(str), c => c.charCodeAt(0)); }
function toB64url(bytes) {
  return toB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hkdf(seed, info, nbytes) {
  const base = await crypto.subtle.importKey('raw', seed, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: HKDF_SALT, info: ENC.encode(info) },
    base, nbytes * 8
  );
  return new Uint8Array(bits);
}

// Depuis la phrase -> { encKey (CryptoKey AES-GCM, reste sur l'appareil), authToken (string) }
export async function deriveSecrets(phrase) {
  const seed = mnemonicToSeedSync((phrase || '').trim().toLowerCase()); // 64 octets
  const encRaw = await hkdf(seed, 'alma-enc-v1', 32);
  const authRaw = await hkdf(seed, 'alma-auth-v1', 32);
  const encKey = await crypto.subtle.importKey('raw', encRaw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  return { encKey, authToken: toB64url(authRaw) };
}

// Objet JSON -> blob base64 (IV 12 octets préfixé). Le serveur ne voit que ce charabia.
export async function encryptJSON(obj, encKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = ENC.encode(JSON.stringify(obj));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, encKey, data));
  const out = new Uint8Array(iv.length + ct.length);
  out.set(iv, 0); out.set(ct, iv.length);
  return toB64(out);
}

// Blob base64 -> objet JSON
export async function decryptJSON(blob, encKey) {
  const raw = fromB64(blob);
  const iv = raw.slice(0, 12);
  const ct = raw.slice(12);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, encKey, ct);
  return JSON.parse(DEC.decode(pt));
}
