"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AccountSignOutButton({
  label,
  className = "btn btn-outline",
  onDone,
}: {
  label: string;
  className?: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await authClient.signOut();
        onDone?.();
        router.push("/");
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
