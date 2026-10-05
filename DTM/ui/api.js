/**
 * DTM UI HTTP client — the only path from the browser to token/group data.
 * Catalog writes, theme CSS, and validation live in the API (`DTM/api`, `DTM/features`).
 * Set `VITE_DTM_API_URL` (e.g. http://127.0.0.1:8110) when the UI is not proxied to the API.
 */

const API_BASE = String(import.meta.env.VITE_DTM_API_URL ?? "").replace(/\/$/, "");

export function apiUrl(path) {
  const next = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${next}`;
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers ?? {}) };
  if (options.body != null && !headers["content-type"] && !headers["Content-Type"]) {
    headers["content-type"] = "application/json";
  }
  const response = await fetch(apiUrl(path), { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.errors?.map((error) => error.message).join(" ") || body.status || response.statusText;
    const error = new Error(message);
    error.body = body;
    throw error;
  }
  return body;
}
