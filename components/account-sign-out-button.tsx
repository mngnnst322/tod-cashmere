"use client";

import { useClerk } from "@clerk/nextjs";

export function AccountSignOutButton({
  label,
  className = "btn btn-outline",
  redirectUrl = "/",
  onDone,
}: {
  label: string;
  className?: string;
  redirectUrl?: string;
  onDone?: () => void;
}) {
  const { signOut } = useClerk();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        onDone?.();
        await signOut({ redirectUrl });
      }}
    >
      {label}
    </button>
  );
}
