import { NextResponse } from "next/server";
import { listProducts } from "@/lib/products";
import { getSessionUser, isStaffRole } from "@/lib/auth-guard";
import { isComingSoon } from "@/lib/site-settings";

// Light product list for the header's live search. Hidden from the public
// while the shop is still in "coming soon" mode, like the shop itself.
export async function GET() {
  if (await isComingSoon()) {
    const user = await getSessionUser();
    if (!user || !isStaffRole(user.role)) return NextResponse.json([]);
  }
  const products = await listProducts();
  return NextResponse.json(
    products.map((p) => ({
      slug: p.slug,
      titleMn: p.titleMn,
      titleEn: p.titleEn,
      titleRu: p.titleRu,
      titleZh: p.titleZh,
      image: p.image,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      badge: p.badge,
    })),
  );
}
