"use client";

import { useState } from "react";
import { label } from "../../ui";

const GROUPS = [
  { title: "Том хүн", sizes: ["S", "M", "L", "XL", "2XL"] },
  { title: "Хүүхэд", sizes: ["9-12 сар", "3-4 нас", "5-6 нас", "7-8 нас", "9-10 нас"] },
];
const ALL = GROUPS.flatMap((g) => g.sizes);

/** Tick the sizes an item comes in; posts them as `sizes` ("S / M / L"). */
export function SizePicker({ defaultValue }: { defaultValue?: string }) {
  const [picked, setPicked] = useState<string[]>(
    (defaultValue ?? "")
      .split("/")
      .map((s) => s.trim())
      .filter((s) => ALL.includes(s)),
  );
  const toggle = (size: string) =>
    setPicked((p) => (p.includes(size) ? p.filter((x) => x !== size) : [...p, size]));
  const value = ALL.filter((s) => picked.includes(s)).join(" / ");

  return (
    <div>
      <span className={label}>Хэмжээ</span>
      <div className="space-y-2">
        {GROUPS.map((g) => (
          <div key={g.title} className="flex flex-wrap items-center gap-2">
            <span className="w-16 text-xs text-adm-mute">{g.title}</span>
            {g.sizes.map((size) => {
              const on = picked.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(size)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition ${
                    on ? "border-adm-ink bg-adm-ink text-white" : "border-adm-line bg-white hover:bg-adm-cream"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <input type="hidden" name="sizes" value={value} />
    </div>
  );
}
