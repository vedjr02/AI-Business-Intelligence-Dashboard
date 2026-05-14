import { getBackendOrigin } from "@/lib/backend-origin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const origin = getBackendOrigin();
  const body = await req.text();
  const upstream = await fetch(`${origin}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const ct =
    upstream.headers.get("content-type") || "text/plain; charset=utf-8";
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "content-type": ct },
  });
}
