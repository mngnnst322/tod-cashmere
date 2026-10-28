import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Serves files kept in R2 under `videos/` (e.g. /api/media/videos/tod-film.mp4)
 * with HTTP Range support, which browsers (Safari especially) need to play and
 * seek video.
 */
export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const key = (await params).path.join("/");
  if (!key.startsWith("videos/")) return new Response("Not found", { status: 404 });
  const { env } = await getCloudflareContext({ async: true });

  const head = await env.PRODUCT_IMAGES.head(key);
  if (!head) return new Response("Not found", { status: 404 });
  const size = head.size;
  const type = head.httpMetadata?.contentType || "application/octet-stream";
  const base = {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range") ?? "");
  if (!match) {
    const object = await env.PRODUCT_IMAGES.get(key);
    if (!object) return new Response("Not found", { status: 404 });
    return new Response(object.body, { headers: { ...base, "Content-Length": String(size) } });
  }

  let start = match[1] ? Number(match[1]) : NaN;
  let end = match[2] ? Number(match[2]) : NaN;
  if (Number.isNaN(start)) {
    // "bytes=-500": the last 500 bytes
    start = Math.max(0, size - end);
    end = size - 1;
  } else if (Number.isNaN(end) || end >= size) {
    end = size - 1;
  }
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }

  const object = await env.PRODUCT_IMAGES.get(key, { range: { offset: start, length: end - start + 1 } });
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, {
    status: 206,
    headers: {
      ...base,
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${size}`,
    },
  });
}
