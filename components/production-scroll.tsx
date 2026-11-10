"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ProductionStep = {
  /** Тойрог дээр харагдах дугаар. Эцсийн бүтээгдэхүүнд null өг. */
  no: number | null;
  label: string;
  src: string;
};

/** Хэдэн px чирэхэд нэг алхам шилжих вэ */
const PX_PER_STEP = 90;
/** Ринг дэх зурагнуудын радиус — эргэн тойрны контейнерийн өргөнөөс хэдэн хувь */
const RADIUS_RATIO = 0.38;

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * "Үйлдвэрлэлийн шат дамжлага" as a ring of step photos that turns by drag,
 * trackpad, arrow keys or the ‹ › buttons. Styled by the `pr-*` classes in
 * public/css/styles.css (the storefront has no Tailwind).
 */
export default function ProductionScroll({
  items,
  hint,
  prevLabel,
  nextLabel,
}: {
  items: ProductionStep[];
  hint: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const count = items.length;
  const stepDeg = 360 / count;

  const [index, setIndex] = useState(0);
  /** Чирэх үеийн завсрын шилжилт (алхмаар, бутархай) */
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hinted, setHinted] = useState(false);
  /** Ринг дэх зурагнуудын бодит радиус (px) — контейнерийн хэмжээнээс тооцно */
  const [radius, setRadius] = useState(0);

  const startX = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  /** Бутархай байрлал — ринг үүгээр жигд эргэнэ */
  const pos = index + drag;
  const active = mod(Math.round(pos), count);
  const prev = mod(active - 1, count);
  const next = mod(active + 1, count);

  const go = useCallback((delta: number) => {
    setHinted(true);
    setIndex((i) => i + delta);
  }, []);

  /* ---------------- Контейнерийн хэмжээгээр радиус тооцно ----------- */
  // transform: translate(%, ...) ЭЛЕМЕНТИЙН ӨӨРИЙН хэмжээнээс тооцогддог тул
  // (w-0 h-0 хайрцаг дээр 38% = 0px болно) px-ээр шууд тооцож өгнө.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => setRadius(el.clientWidth * RADIUS_RATIO);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---------------- Чирэх (mouse + touch) ---------------- */

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    setDragging(true);
    setHinted(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDrag(-(e.clientX - startX.current) / PX_PER_STEP);
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    setIndex((i) => Math.round(i + drag));
    setDrag(0);
  };

  /* ---------------- Хэвтээ scroll (trackpad) ---------------- */

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let acc = 0;
    const onWheel = (e: WheelEvent) => {
      // Зөвхөн хэвтээ хөдөлгөөнд хариулна — босоо scroll хэвээрээ ажиллана
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      acc += e.deltaX;
      if (Math.abs(acc) >= PX_PER_STEP) {
        go(acc > 0 ? 1 : -1);
        acc = 0;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go]);

  /* ---------------- Товчлуур ---------------- */

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  /* ---------------- Ринг ---------------- */

  const ring = useMemo(
    () =>
      items.map((step, i) => {
        // 0° = баруун талд, +° = цагийн зүүний дагуу (дэлгэцийн y доошоо)
        // Идэвхтэй нь доод талд ирнэ; 1 → доод, 2 → зүүн тийш
        const deg = 90 - (i - pos) * stepDeg;
        return { step, i, deg };
      }),
    [items, pos, stepDeg]
  );

  const trio = [
    { s: items[prev], key: "prev" as const },
    { s: items[active], key: "active" as const },
    { s: items[next], key: "next" as const },
  ];

  return (
    <div className="production-ring">
      <div
        ref={rootRef}
        tabIndex={0}
        role="group"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="pr-stage"
      >
        {/* ---------- Бүдэг ринг ---------- */}
        <div className="pr-ringlayer">
          {/* холбоос шугам */}
          <div className="pr-track" />

          {ring.map(({ step, i, deg }) => {
            const d = Math.abs(((i - pos + count / 2) % count) - count / 2);
            const isNear = d < 1.5;
            const opacity = isNear ? 1 - d * 0.45 : 0.35;
            const scale = isNear ? 1 - d * 0.18 : 0.72;

            return (
              <div
                key={i}
                className="pr-slot"
                style={{
                  transform: `rotate(${deg}deg) translate(${radius}px, 0) rotate(${-deg}deg)`,
                  transition: dragging ? "none" : "transform 420ms cubic-bezier(.22,1,.36,1)",
                }}
              >
                <div
                  style={{
                    opacity,
                    transform: `scale(${scale}) translate(-50%, -50%)`,
                    transformOrigin: "top left",
                    transition: dragging ? "none" : "opacity 420ms, transform 420ms",
                  }}
                >
                  <div className="pr-dot">
                    <img
                      src={step.src}
                      alt=""
                    />
                    {step.no !== null && (
                      <span className="pr-badge">
                        {step.no}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------- Гол: өмнөх – идэвхтэй – дараагийн ---------- */}
        <div className="pr-center">
          {trio.map(({ s, key }) => {
            const isActive = key === "active";
            return (
              <figure
                key={key + s.label}
                // Утсан дээр зөвхөн идэвхтэй зургийг харуулна — хажуугийн
                // өмнөх/дараагийн жижиг тойргууд нарийн дэлгэцэнд хасагдана.
                className={`pr-fig ${isActive ? "is-active" : ""}`}
              >
                <img
                  src={s.src}
                  alt={s.label}
                />
                {/* prev/next зураг дундах ринг дугаараа бараг бvрэн дарж байсан тул
                    өөрийнх нь дугаарыг энд тод харуулна */}
                {!isActive && s.no !== null && (
                  <span className="pr-badge pr-badge--lg">
                    {s.no}
                  </span>
                )}
                {isActive && (
                  // Гарчгийг absolute болгосон — RU/ZH зэрэг 2 мөр болох хэлэнд ч
                  // идэвхтэй зураг байрнаасаа хөдлөхгүй, гарчиг үргэлж ижил цэгээс эхэлнэ.
                  // Жижиг, нарийн байлгана — томдвол доорх рингийн дугаартай тойргуудтай давхцдаг.
                  <figcaption className="pr-caption">
                    {s.no !== null && <span>{s.no}.</span>}
                    {s.label}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>

        {/* ---------- Сумнууд ---------- */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => go(-1)}
          aria-label={prevLabel}
          className="pr-arrow pr-arrow--prev"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => go(1)}
          aria-label={nextLabel}
          className="pr-arrow pr-arrow--next"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* ---------- Чирэх заавар ---------- */}
        <p className={`pr-hint ${hinted ? "is-hidden" : ""}`}>
          {hint}
        </p>
      </div>

    </div>
  );
}
