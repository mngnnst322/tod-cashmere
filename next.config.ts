import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Changes on every build so /css/*.css links (see app/layout.tsx) bust the
  // browser cache after each deploy.
  env: { NEXT_PUBLIC_ASSET_VERSION: Date.now().toString(36) },
  images: {
    // Every photo is served at 90% (the default 75 softened clothing detail);
    // with one allowed value, all <Image> quality requests resolve to it.
    qualities: [90],
  },
  experimental: {
    // Admin forms upload product and catalog photos through Server Actions,
    // which are capped at 1MB by default.
    serverActions: { bodySizeLimit: "25mb" },
  },
  // Common guesses for the sign-in URL all land on Clerk's /sign-in page.
  redirects() {
    return [
      ...["/login", "/admin/login", "/account/login"].map((source) => ({
        source,
        destination: "/sign-in",
        permanent: false,
      })),
      // The catalog used to live at /katalog; keep old links working.
      { source: "/katalog", destination: "/catalog", permanent: true },
      { source: "/katalog/:id", destination: "/catalog/:id", permanent: true },
    ];
  },
};

export default nextConfig;

// Local dev uses local bindings only; remote ones (Workers AI) need a Cloudflare
// login and would fail every request, so translation is skipped locally.
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev({ remoteBindings: false }));
