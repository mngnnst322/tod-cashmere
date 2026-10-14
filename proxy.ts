import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

// Auth checks live where the data is read: app/admin/(protected)/layout.tsx,
// app/(storefront)/account/page.tsx and every admin server action.
export default clerkMiddleware((_auth, req) => {
  // Layouts can't see the URL, so pass it along (the storefront layout uses it
  // to keep /sign-in reachable while the site is in "coming soon" mode).
  const headers = new Headers(req.headers);
  headers.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|png|avif|mp4))(?:.*)|api|trpc)(.*)",
  ],
};
