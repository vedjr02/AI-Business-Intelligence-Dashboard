import { getBackendOrigin } from "@/lib/backend-origin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const origin = getBackendOrigin();
  const formData = await req.formData();
  const upstream = await fetch(`${origin}/api/upload`, {
    method: "POST",
    body: formData,
  });
  const ct =
    upstream.headers.get("content-type") || "application/json; charset=utf-8";
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "content-type": ct },
  });
}
