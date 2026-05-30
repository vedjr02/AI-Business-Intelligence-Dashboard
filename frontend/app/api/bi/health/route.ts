import { getBackendOrigin } from "@/lib/backend-origin";

export const runtime = "nodejs";

export async function GET() {
  const origin = getBackendOrigin();
  try {
    const res = await fetch(`${origin}/health`, { cache: "no-store" });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return Response.json(
      { status: "error", service: "lumen-bi-bff", upstream: origin },
      { status: 503 }
    );
  }
}
