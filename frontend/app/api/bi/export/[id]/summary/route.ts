import { getBackendOrigin } from "@/lib/backend-origin";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const origin = getBackendOrigin();
  const upstream = await fetch(
    `${origin}/api/export/${encodeURIComponent(id)}/summary`,
    { method: "POST" }
  );
  const ct =
    upstream.headers.get("content-type") || "application/json; charset=utf-8";
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "content-type": ct },
  });
}
