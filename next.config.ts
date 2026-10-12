import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Common guesses for the sign-in URL all land on Clerk's /sign-in page.
  redirects() {
    return ["/login", "/admin/login", "/account/login"].map((source) => ({
      source,
      destination: "/sign-in",
      permanent: false,
    }));
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
