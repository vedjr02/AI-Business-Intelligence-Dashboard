/**
 * Upstream FastAPI base URL — **server-only** (Route Handlers / Server Actions).
 * Prefer BACKEND_URL in production so the real API host is not exposed to the client.
 */
export function getBackendOrigin(): string {
  const raw =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";
  return raw.replace(/\/$/, "");
}
