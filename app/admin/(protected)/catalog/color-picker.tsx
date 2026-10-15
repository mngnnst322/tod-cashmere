"use client";

import { useState } from "react";
import { CASHMERE_COLORS, findCashmereColor, splitColors } from "@/lib/catalog-colors";
import { input, label } from "../../ui";

/**
 * Tick the cashmere colours an item comes in. Posts them as `colors`
 * ("Camel, Ivory, …"); colours typed in the extra box are kept as written.
 */
export function ColorPicker({ defaultValue }: { defaultValue?: string }) {
  const initial = splitColors(defaultValue ?? "");
  // Palette colours become ticks; anything else (older names) stays in the box.
  const inPalette = (c: string) => {
    const found = findCashmereColor(c);
    return found && CASHMERE_COLORS.includes(found) ? found.name : null;
  };
  const [picked, setPicked] = useState<string[]>(
    initial.map(inPalette).filter((n): n is string => !!n),
  );
  const [other, setOther] = useState(initial.filter((c) => !inPalette(c)).join(", "));

  const toggle = (name: string) =>
    setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  // Keep palette order so every item lists colours the same way.
  const ordered = CASHMERE_COLORS.map((c) => c.name).filter((n) => picked.includes(n));
  const value = [...ordered, ...splitColors(other)].join(", ");

  return (
    <div>
      <span className={label}>Өнгө</span>
      <div className="flex flex-wrap gap-2">
        {CASHMERE_COLORS.map((c) => {
          const on = picked.includes(c.name);
          return (
            <button
              key={c.name}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(c.name)}
              className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-sm transition ${
                on ? "border-adm-ink bg-adm-ink text-white" : "border-adm-line bg-white hover:bg-adm-cream"
              }`}
            >
              <span
                className="h-5 w-5 rounded-full border border-black/10"
                style={{ background: c.hex }}
              />
              {c.names.mn}
            </button>
          );
        })}
      </div>
      <input
        value={other}
        onChange={(e) => setOther(e.target.value)}
        placeholder="Бусад өнгө (таслалаар): Camel, Ivory"
        className={`${input} mt-3`}
      />
      <input type="hidden" name="colors" value={value} />
    </div>
  );
}
