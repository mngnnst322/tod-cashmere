"use client";

import { useState, useTransition } from "react";
import { grantRole } from "@/lib/admin-actions";
import { STAFF_ROLES, type StaffRole } from "@/lib/roles";
import { Modal } from "../modal";
import { ROLE_DESCRIPTIONS, btnDark, btnSoft, input } from "../../ui";

export function GrantRoleButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("admin");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const close = () => {
    setOpen(false);
    setEmail("");
    setRole("admin");
    setError("");
  };

  return (
    <>
      <button type="button" className={btnSoft} onClick={() => setOpen(true)}>
        + Эрх нэмэх
      </button>
      <Modal
        open={open}
        onClose={close}
        title="Эрх нэмэх"
        subtitle="Бүртгэлтэй хэрэглэгчийн имэйлийг оруулж эрх олгоно."
      >
        <form
          className="space-y-3"
          action={(formData) =>
            startTransition(async () => {
              const result = await grantRole(formData);
              if (result.ok) close();
              else setError(result.error);
            })
          }
        >
          <input
            type="email"
            name="email"
            required
            autoFocus
            placeholder="email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
          />
          {STAFF_ROLES.map((r) => (
            <label
              key={r}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-[15px] transition ${
                role === r ? "border-adm-ink bg-adm-cream" : "border-adm-line hover:border-adm-sand"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
                className="h-4 w-4 accent-adm-ink"
              />
              {ROLE_DESCRIPTIONS[r]}
            </label>
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className={`${btnDark} w-full normal-case tracking-normal`}
            disabled={pending || !email}
          >
            {pending ? "Түр хүлээнэ үү..." : "Эрх олгох"}
          </button>
        </form>
      </Modal>
    </>
  );
}
