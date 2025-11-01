const ENV_BASE = import.meta.env.VITE_API_URL;
const DEFAULT_BASE =
  ENV_BASE ??
  (import.meta.env.DEV ? "http://localhost:3000" : window.location.origin);

const API_BASE = stripTrailingSlash(DEFAULT_BASE);
const DEFAULT_TIMEOUT_MS = 12000; // 12s

function stripTrailingSlash(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function ensureLeadingSlash(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

function buildUrl(endpoint, params) {
  const url = new URL(API_BASE + ensureLeadingSlash(endpoint));
  if (params && typeof params === "object") {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function withTimeout(ms = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
}

async function handle(res) {
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Request failed: ${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** GET with optional query params */
export async function apiGet(endpoint, params, { timeout } = {}) {
  const { signal, clear } = withTimeout(timeout);
  const url = buildUrl(endpoint, params);
  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      signal,
    });
    return await handle(res);
  } finally {
    clear();
  }
}

/** POST JSON */
export async function apiPost(endpoint, body, { timeout } = {}) {
  const { signal, clear } = withTimeout(timeout);
  const url = buildUrl(endpoint);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body ?? {}),
      signal,
    });
    return await handle(res);
  } finally {
    clear();
  }
}

/** PUT JSON */
export async function apiPut(endpoint, body, { timeout } = {}) {
  const { signal, clear } = withTimeout(timeout);
  const url = buildUrl(endpoint);
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body ?? {}),
      signal,
    });
    return await handle(res);
  } finally {
    clear();
  }
}

/** DELETE (optional JSON body) */
export async function apiDelete(endpoint, body, { timeout } = {}) {
  const { signal, clear } = withTimeout(timeout);
  const url = buildUrl(endpoint);
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
    return await handle(res);
  } finally {
    clear();
  }
}

// For debugging:
export function getApiBase() {
  return API_BASE;
}
