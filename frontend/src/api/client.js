const API_BASE = import.meta.env.VITE_API_URL;

export async function apiGet(endpoint) {
    console.log("Fetching:", `${API_BASE}${endpoint}`);
    const res = await fetch(`${API_BASE}${endpoint}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
    return res.json();
  }

export async function apiPost(endpoint, data) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.status}`);
  return res.json();
}
