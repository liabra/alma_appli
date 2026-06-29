import { describe, it, expect } from 'vitest';
const mem = {};
globalThis.localStorage = {
  getItem: (k) => (k in mem ? mem[k] : null),
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
};
const { bundleLocalData, applyBundle } = await import('./vaultSync.js');

describe('vaultSync bundle', () => {
  it('bundle puis apply restitue les clés', () => {
    mem['alma_user'] = JSON.stringify({ uuid: 'x' });
    mem['alma_session'] = JSON.stringify({ tetees: [1, 2] });
    const b = bundleLocalData();
    expect(b.alma_user).toEqual({ uuid: 'x' });
    delete mem['alma_user']; delete mem['alma_session'];
    applyBundle(b);
    expect(JSON.parse(mem['alma_user'])).toEqual({ uuid: 'x' });
    expect(JSON.parse(mem['alma_session'])).toEqual({ tetees: [1, 2] });
  });
});
