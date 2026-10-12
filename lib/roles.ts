// Role constants, safe to import from client components.

/**
 * Roles live in Clerk public metadata (`{ "role": "admin" }`), which users
 * can't edit themselves. Admins grant them from /admin/settings.
 *  - admin:  everything
 *  - orders: order-fulfilment staff — can view the dashboard, products and orders
 *  - packer: packing staff — only the /admin/beltgel packing queue
 */
export const STAFF_ROLES = ["admin", "orders", "packer"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];
export type Role = StaffRole | "user";

export function isStaffRole(value: unknown): value is StaffRole {
  return STAFF_ROLES.includes(value as StaffRole);
}

/** Where each role lands when it opens the admin. */
export function staffHome(role: Role) {
  return role === "packer" ? "/admin/beltgel" : "/admin";
}
