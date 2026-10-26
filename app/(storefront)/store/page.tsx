import { getLang } from "@/lib/i18n-server";

export const metadata = { title: "Дэлгүүрийн байршил – Tod Cashmere" };

// Tod Cashmere's Google Maps place (the shop at the factory building).
const MAP_URL =
  "https://www.google.com/maps/place/Tod+cashmere/@47.8872617,106.7938157,663m/data=!3m1!1e3!4m6!3m5!1s0x5d96ed001559410b:0xafbbdc9aa30fc63e!8m2!3d47.8853771!4d106.791122!16s%2Fg%2F11whtdz2kg";
const EMBED_URL = "https://www.google.com/maps?q=Tod+cashmere@47.8853771,106.791122&z=16&output=embed";

const text = {
  mn: {
    title: "Дэлгүүрийн байршил",
    address: "“ТОД кашмер” үйлдвэрийн байр, 20-р хороо, Баянгол дүүрэг, Улаанбаатар хот",
    open: "Google Map-аас харах",
  },
  en: {
    title: "Store location",
    address: "“TOD Cashmere” factory building, 20th khoroo, Bayangol district, Ulaanbaatar",
    open: "Open in Google Maps",
  },
  ru: {
    title: "Адрес магазина",
    address: "Фабрика «ТОД кашмер», 20-й хороо, Баянгольский район, Улан-Батор",
    open: "Открыть в Google Картах",
  },
  zh: {
    title: "门店位置",
    address: "“TOD 羊绒”工厂大楼，乌兰巴托市巴音高勒区第20分区",
    open: "在谷歌地图中查看",
  },
};

export default async function StorePage() {
  const t = text[await getLang()];
  return (
    <section className="section store-page">
      <h1 className="store-title">{t.title}</h1>
      <p className="store-address">{t.address}</p>
      <p className="store-contact">
        <a href="tel:+97680310023">+976 80310023</a> ·{" "}
        <a href="mailto:todcashmere@gmail.com">todcashmere@gmail.com</a>
      </p>
      <div className="store-map">
        <iframe
          src={EMBED_URL}
          title={t.title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a className="store-map-link" href={MAP_URL} target="_blank" rel="noopener noreferrer">
        {t.open} →
      </a>
    </section>
  );
}
