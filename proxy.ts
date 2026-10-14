import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

const PREVIEW_COOKIE = "site_preview";

// Auth checks live where the data is read: app/admin/(protected)/layout.tsx,
// app/(storefront)/account/page.tsx and every admin server action.
export default clerkMiddleware((_auth, req) => {
  // Layouts can't see the URL, so pass it along (the storefront layout uses it
  // to keep /sign-in reachable while the site is in "coming soon" mode).
  const headers = new Headers(req.headers);
  headers.set("x-pathname", req.nextUrl.pathname);

  // /katalog is a share link to the real storefront while the site is still
  // "coming soon": it shows the home page and remembers the visitor so the
  // rest of the shop opens for them too.
  const isPreviewLink = req.nextUrl.pathname === "/katalog";
  if (isPreviewLink || req.cookies.get(PREVIEW_COOKIE)?.value === "1") {
    headers.set("x-site-preview", "1");
  }
  if (!isPreviewLink) return NextResponse.next({ request: { headers } });

  const res = NextResponse.rewrite(new URL("/", req.url), { request: { headers } });
  res.cookies.set(PREVIEW_COOKIE, "1", { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
  return res;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|png|avif|mp4))(?:.*)|api|trpc)(.*)",
  ],
};
