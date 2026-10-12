import Image from "next/image";
import type { Dict } from "@/lib/i18n";

export function ComingSoon({ dict }: { dict: Dict }) {
  return (
    <main className="coming-soon">
      <Image
        src="/images/web-logo.png"
        alt="Tod Cashmere"
        width={320}
        height={320}
        priority
        className="coming-soon-logo"
      />
      <h1 className="coming-soon-title">{dict.comingSoon}</h1>
      <p className="coming-soon-text">{dict.comingSoonText}</p>
    </main>
  );
}
