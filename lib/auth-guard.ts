import { headers } from "next/headers";
import { getAuth } from "./auth";

export async function getSessionUser() {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

/** Throws unless the caller is signed in with the "admin" role. */
export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}
