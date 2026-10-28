import Image from "next/image";

export const metadata = { title: "Бидний тухай – Tod Cashmere" };

const values = [
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

// "Бидний тухай": the company's values, linked from the footer.
export default function AboutPage() {
  return (
    <article className="section care-page">
      <header className="care-intro">
        <h1>Бидний тухай</h1>
        <p>Монголын хээр тал, нүүдэлчдийн соёлоос таны гарт.</p>
      </header>
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
