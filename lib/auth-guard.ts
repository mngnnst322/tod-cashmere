import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isStaffRole, staffHome, type Role, type StaffRole } from "./roles";

export { STAFF_ROLES, isStaffRole, staffHome } from "./roles";
export type { Role, StaffRole } from "./roles";

export async function getSessionUser() {
  const user = await currentUser();
  if (!user) return null;
  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const role: Role = isStaffRole(user.publicMetadata.role)
    ? user.publicMetadata.role
    : "user";
  return {
    id: user.id,
    name: user.fullName || user.username || email,
    email,
    imageUrl: user.imageUrl,
    role,
    createdAt: new Date(user.createdAt),
  };
}

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;

/** Throws unless the caller is signed in with one of `roles`. */
export async function requireRole(...roles: StaffRole[]) {
  const user = await getSessionUser();
  if (!user || !(roles as Role[]).includes(user.role)) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * For admin pages: signed-out visitors go to sign-in, staff without access to
 * this page go to their own admin home, everyone else to their profile.
 */
export async function guardPage(...roles: StaffRole[]) {
  const user = await getSessionUser();
  if (!user) return (await auth()).redirectToSignIn();
  if (!(roles as Role[]).includes(user.role)) {
    redirect(isStaffRole(user.role) ? staffHome(user.role) : "/account");
  }
  return user as SessionUser & { role: StaffRole };
}

export function requireAdmin() {
  return requireRole("admin");
}

/** The Clerk user id of the current request, if signed in. */
export async function getUserId() {
  return (await auth()).userId;
}
