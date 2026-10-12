"use client";

import { useState, useTransition } from "react";
import { importPrices } from "@/lib/admin-actions";
import { Modal } from "../modal";
import { btnDark, btnOutline, icons } from "../../ui";

export function PriceImportButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button type="button" className={btnOutline} onClick={() => setOpen(true)}>
        {icons.upload}
        Үнэ оруулах
      </button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setMessage("");
        }}
        title="Үнэ оруулах"
        subtitle="CSV файлын эхний мөр: slug,price,compare_at_price. Excel татсан файлаа засаад шууд оруулж болно."
      >
        <form
          className="space-y-4"
          action={(formData) =>
            startTransition(async () => {
              const result = await importPrices(formData);
              setMessage(
                result.ok
                  ? `${result.updated} барааны үнэ шинэчлэгдлээ.` +
                      (result.missing.length
                        ? ` Олдоогүй slug: ${result.missing.slice(0, 5).join(", ")}${result.missing.length > 5 ? "…" : ""}`
                        : "")
                  : result.error,
              );
            })
          }
        >
          <input
            type="file"
            name="file"
            accept=".csv,text/csv"
            required
            className="block w-full rounded-lg border border-adm-line bg-white px-4 py-3 text-sm"
          />
          {message && <p className="text-sm text-adm-ink/80">{message}</p>}
          <button type="submit" className={`${btnDark} w-full`} disabled={pending}>
            {pending ? "Оруулж байна..." : "Оруулах"}
          </button>
        </form>
      </Modal>
    </>
  );
}
