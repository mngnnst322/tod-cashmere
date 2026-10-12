"use client";

import { useTransition } from "react";

/** A button that asks before running a (server) action — used for deletes. */
export function ConfirmButton({
  action,
  message,
  className = "text-red-600 hover:underline",
  children,
}: {
  action: () => Promise<void>;
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => {
        if (confirm(message)) startTransition(action);
      }}
    >
      {children}
    </button>
  );
}
