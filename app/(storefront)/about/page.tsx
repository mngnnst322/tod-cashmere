import Image from "next/image";

export const metadata = { title: "Бидний тухай – Tod Cashmere" };

// "Бидний зорилт" (objectives).
const values = [
  {
    title: "Өв соёл, уламжлал",
    image: "/images/katalog-page-2.jpg",
    text: "Монголын түүх, нүүдэлчдийн соёл, үндэсний өв уламжлалыг бүтээгдэхүүний загвар, хийц, хэв маягт шингээж, орчин үеийн хэрэглээнд нийцүүлэн дэлхийд таниулах.",
  },
  {
    title: "Чанар",
    image: "/images/care/store.jpg",
    text: "Түүхий эдийн сонголтоос эхлээд үйлдвэрлэл, эцсийн бүтээгдэхүүн хүртэлх бүх үе шатанд чанарын өндөр стандартыг мөрдөж, бүтээгдэхүүний чанар, эдэлгээ, хийцийг тасралтгүй сайжруулах.",
  },
  {
    title: "Бүтээгдэхүүн, инновац",
    image: "/images/emegtei.png",
    text: "Хэрэглэгчдийн хувьсан өөрчлөгдөж буй хэрэгцээ, олон улсын загварын чиг хандлагад нийцсэн өвөрмөц загвар, шинэ коллекц, шинэлэг бүтээгдэхүүнийг тогтмол хөгжүүлэх.",
  },
];

// "Бидний тухай": vision, mission and values, linked from the footer.
const purpose = [
  {
    title: "Алсын хараа",
    text: "Монголын өв соёл, түүх, нүүдэлчдийн уламжлалыг шингээсэн ноолууран бүтээгдэхүүний үнэ цэн, чанар, өвөрмөц онцлогийг дэлхийд таниулж, тогтвортой үйлдвэрлэлээрээ тэргүүлэгч дэлхийн брэнд болох.",
  },
  {
    title: "Эрхэм зорилго",
    text: "Монгол ноолуурын байгалийн онцлог, уламжлалт ур ухаан, дээд зэргийн чанарыг орчин үеийн загвар, дэвшилтэт технологитой хослуулан, хэрэглэгчдийн хэрэгцээ, хүлээлтэд нийцсэн үнэ цэнтэй бүтээгдэхүүн бүтээж, Монголын өв соёлыг дэлхийд түгээн дэлгэрүүлэх.",
  },
  {
    title: "Бидний зорилго",
    text: "Монгол ноолуурын чанар, өвөрмөц шинж чанарыг хадгалсан, олон улсын стандарт шаардлагад нийцсэн бүтээгдэхүүн үйлдвэрлэж, “Тод Кашмер” брэндийн нэр хүнд, үнэ цэн, өрсөлдөх чадварыг тасралтгүй нэмэгдүүлэх.",
  },
];

export default function AboutPage() {
  return (
    <article className="section care-page">
      <header className="care-intro">
        <h1>Бидний тухай</h1>
        <p>Монголын хээр тал, нүүдэлчдийн соёлоос таны гарт.</p>
      </header>
      <div className="about-purpose">
        {purpose.map((p) => (
          <section key={p.title}>
            <h2 className="about-value-title">{p.title}</h2>
            <p>{p.text}</p>
          </section>
        ))}
      </div>
      <h2 className="about-objectives-title">Бидний зорилт</h2>
      {values.map((v, i) => (
        <section key={v.title} className={`care-section ${i % 2 ? "is-flipped" : ""}`}>
          <div className="care-image">
            <Image src={v.image} alt="" fill sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
          <div className="care-text">
            <h2 className="about-value-title">{v.title}</h2>
            <p>{v.text}</p>
          </div>
        </section>
      ))}
    </article>
  );
}
