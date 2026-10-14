import type { Lang } from "@/lib/i18n";

/** Small inline flag for each site language (emoji flags don't show on Windows). */
export function LangFlag({ lang }: { lang: Lang }) {
  return (
    <svg className="lang-flag" viewBox="0 0 30 20" aria-hidden="true">
      {lang === "mn" && (
        <>
          <rect width="30" height="20" fill="#c4272f" />
          <rect x="10" width="10" height="20" fill="#015197" />
          <circle cx="5" cy="8" r="1.6" fill="#f9cf02" />
          <rect x="3.6" y="10.5" width="2.8" height="5" fill="#f9cf02" />
        </>
      )}
      {lang === "en" && (
        <>
          <rect width="30" height="20" fill="#fff" />
          {[0, 2, 4, 6, 8, 10, 12].map((i) => (
            <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#b22234" />
          ))}
          <rect width="13" height={(7 * 20) / 13} fill="#3c3b6e" />
        </>
      )}
      {lang === "ru" && (
        <>
          <rect width="30" height="20" fill="#fff" />
          <rect y="6.67" width="30" height="6.67" fill="#0039a6" />
          <rect y="13.33" width="30" height="6.67" fill="#d52b1e" />
        </>
      )}
      {lang === "zh" && (
        <>
          <rect width="30" height="20" fill="#de2910" />
          <polygon
            points="5,2.5 5.9,5.2 8.7,5.2 6.4,6.9 7.3,9.6 5,7.9 2.7,9.6 3.6,6.9 1.3,5.2 4.1,5.2"
            fill="#ffde00"
          />
        </>
      )}
    </svg>
  );
}
