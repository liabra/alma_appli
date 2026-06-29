const BASE = import.meta.env.VITE_API_URL || '';

async function req(path, method, authToken, body) {
  return fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function initVault(authToken) {
  const res = await req('/vault/init', 'POST', authToken);
  if (!res.ok) throw new Error('init ' + res.status);
  return res.json();
}
export async function pullVault(authToken) {
  const res = await req('/vault', 'GET', authToken);
  if (res.status === 404) return null;          // pas encore de coffre
  if (!res.ok) throw new Error('pull ' + res.status);
  return res.json();                            // { blob, version, updated_at }
}
export async function pushVault(authToken, blob, baseVersion) {
  const res = await req('/vault', 'PUT', authToken, { blob, base_version: baseVersion ?? null });
  if (!res.ok) throw new Error('push ' + res.status);
  return res.json();                            // { version, updated_at }
}
