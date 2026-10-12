import { requireAdmin } from "@/lib/auth-guard";
import { csvResponse } from "@/lib/csv";
import { listAllProducts } from "@/lib/products";

// The column names match what "Үнэ оруулах" (importPrices) reads back in.
export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return new Response("Forbidden", { status: 403 });
  }
  const url = new URL(request.url);
  const withImages = url.searchParams.get("images") === "1";
  const products = await listAllProducts();

  const header = [
    "slug",
    "title_mn",
    "title_en",
    "category",
    "collection",
    "price",
    "compare_at_price",
    "stock",
    "in_stock",
    "hidden",
    "color",
    ...(withImages ? ["image_url"] : []),
  ];
  const rows = products.map((p) => [
    p.slug,
    p.titleMn,
    p.titleEn,
    p.categorySlug,
    p.collection,
    p.price,
    p.compareAtPrice,
    p.stock,
    p.inStock ? 1 : 0,
    p.hidden ? 1 : 0,
    p.color,
    ...(withImages ? [new URL(p.image, url.origin).toString()] : []),
  ]);

  const date = new Date().toISOString().slice(0, 10);
  return csvResponse(
    `products${withImages ? "-images" : ""}-${date}.csv`,
    [header, ...rows],
  );
}
