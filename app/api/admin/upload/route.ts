import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireAdmin } from "@/lib/auth-guard";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/**
 * Stores one admin photo in R2. The browser sends the raw file as the body,
 * so the Worker only copies bytes; parsing large multipart forms in a Server
 * Action ran past the Worker CPU limit.
 */
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
  const type = request.headers.get("content-type") ?? "";
  const ext = EXTENSIONS[type];
  if (!ext) return new Response("Unsupported image type", { status: 415 });
  const { env } = await getCloudflareContext({ async: true });
  const key = `${crypto.randomUUID()}.${ext}`;
  await env.PRODUCT_IMAGES.put(key, await request.arrayBuffer(), {
    httpMetadata: { contentType: type },
  });
  return Response.json({ path: `/api/images/${key}` });
}
