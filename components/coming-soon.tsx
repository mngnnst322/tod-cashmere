import Image from "next/image";

// Pre-launch screen. The copy is bilingual on purpose, so it ignores the
// visitor's language setting.
export function ComingSoon() {
  return (
    <main className="coming-soon">
      <div className="coming-soon-inner">
        <Image
          src="/images/web-logo.png"
          alt="Tod Cashmere"
          width={320}
          height={320}
          priority
          className="coming-soon-logo"
        />
        <h1 className="coming-soon-lead">Бид удахгүй эргэн ирнэ.</h1>
        <p className="coming-soon-text">We’ll be back soon.</p>
        <p className="coming-soon-text">
          Бид танд илүү сайжруулсан цахим орчныг хүргэхээр ажиллаж байна. Түр
          хүлээлгэсэнд хүлцэл өчье.
        </p>
        <p className="coming-soon-text">
          Монголын хээр тал, нүүдэлчдийн соёлоос таны гарт.
        </p>
      </div>
    </main>
  );
}
