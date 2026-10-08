import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "./db";
import * as schema from "./db/schema";

let cached: Awaited<ReturnType<typeof buildAuth>> | null = null;

async function buildAuth() {
  const db = await getDb();
  const { env } = await getCloudflareContext({ async: true });
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
      usePlural: false,
    }),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        // input: false — sign-up requests can't choose their own role.
        role: { type: "string", defaultValue: "user", input: false },
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
  });
}

// D1 bindings are only available inside a request's execution context, so the
// auth instance is built lazily on first use rather than at module load time.
export async function getAuth() {
  if (!cached) {
    cached = await buildAuth();
  }
  return cached;
}
