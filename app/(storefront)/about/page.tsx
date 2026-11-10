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

// Company story, shown under the page heading.
const story = [
  {
    title: "Бидний тухай",
    paragraphs: [
      "“ТОД ОЙМС” ХХК нь 2011 онд үүсгэн байгуулагдсан, дотоодын 100 хувийн хөрөнгө оруулалттай, Монгол Улсад бүх төрлийн оймс үйлдвэрлэлийн чиглэлээр үйл ажиллагаа явуулдаг компани юм.",
      "Бид Хонь болон Тэмээний ноос, Сарлагийн хөөвөр, Ямааны ноолуур болон Хөвөн даавуун утсаар төрөл бүрийн оймс үйлдвэрлэж, бүтээгдэхүүнээ Монгол Улс болон дэлхийн 16 улсад худалдаалдаг. Өнөөдөр манай компани 200 гаруй ажилтантай, 14,500м.кв үйлдвэрлэлийн талбайд үйл ажиллагаагаа явуулж байна.",
    ],
  },
  {
    title: "Малчнаас эцсийн бүтээгдэхүүн хүртэл",
    paragraphs: [
      "Бид жил бүр малчдаас ноос, ноолуур, хөөвөр худалдан авч, өөрийн ноос, ноолуур боловсруулах болон ээрэх үйлдвэрүүдэд анхдагч түүхий эдийг боловсруулан, чанартай утас үйлдвэрлэж, улмаар эцсийн бүтээгдэхүүнээ үйлдвэрлэдэг. Ийнхүү анхдагч түүхий эдээс эцсийн бүтээгдэхүүн хүртэлх үйлдвэрлэлийн бүх үе шатыг өөрийн үйлдвэрлэлээр гүйцэтгэдэг тул чанартай бүтээгдэхүүнийг хэрэглэгчдэд өрсөлдөхүйц үнээр хүргэж байна.",
    ],
  },
  {
    title: "Хөвөн даавуун оймс",
    paragraphs: [
      "Мөн БНСУ, БНХАУ-д үйлдвэрлэсэн, Монгол Улсын мэргэжлийн байгууллагуудын хяналт, сорилд тэнцсэн хөвөн даавуун утсыг ашиглан бүх насны хэрэглэгчдэд зориулсан төрөл бүрийн загвар, коллекц боловсруулж, даавуун оймс үйлдвэрлэн худалдаалдаг. Үүнд: Ярьдаг оймс, Спорт, Уулын, Иог, Мерч (Merch), Чимэглэлтэй зэрэг олон төрлийн бүтээгдэхүүний цуврал багтана.",
      "Хөвөн утас нь байгалийн гаралтай хөвөн (Cotton) ургамлын ширхэгтээс гарган авч, ээрч боловсруулсан утас юм.",
      "Түүнчлэн гадаад болон дотоодын харилцагч, хэрэглэгчдийн захиалгын дагуу ноос, ноолуураар сүлжмэл бүтээгдэхүүн үйлдвэрлэн экспортолж байна.",
    ],
  },
];

// Certificates shown under "Чанар, стандарт ба баталгаажуулалт".
const certificates = [
  { src: "/images/1.png", alt: "Органик бүтээгдэхүүн – Certified Organic" },
  { src: "/images/2.png", alt: "ISO 9001" },
  { src: "/images/3.png", alt: "Mongolia AEO – Гаалийн итгэмжлэгдсэн аж ахуйн нэгж" },
  { src: "/images/4.png", alt: "Rangeland – Green Gold" },
  { src: "/images/5.png", alt: "Responsible Nomads Standard" },
];

// Production, after the quality section.
const production = [
  {
    title: "Үйлдвэрлэлийн үйл ажиллагаа",
    text: "Бид үйлдвэрлэлийн технологи, тоног төхөөрөмжийн шинэчлэлд тогтмол хөрөнгө оруулалт хийж, жил бүр сүүлийн үеийн дэвшилтэт сүлжих машин, тоног төхөөрөмжийг үйлдвэрлэлдээ нэвтрүүлэн ажилладаг. Ингэснээр бид оймсны үйлдвэрлэлийн технологийн хөгжлийг цаг алдалгүй нэвтрүүлж, Олон Улсын жишигт нийцсэн бүтээгдэхүүний төрөл, загварыг бий болгож байна.",
  },
];

// Each step has a round photo at /images/steps/01.png … 14.png.
const steps = [
  "Малчдаас ноос, ноолуур, хөөвөр худалдан авах",
  "Угаах",
  "Хялгас ялгах",
  "Самнах",
  "Утас ээрэх",
  "Тод кашмер, Тод Оймс үйлдвэр",
  "Загвар зохион бүтээх",
  "Сүлжих",
  "Чанарын хяналт",
  "Битүүлж оёх",
  "Угаах, индүүдэх",
  "Чанарын хяналт",
  "Шошголж савлах",
  "Эцсийн бүтээгдэхүүн",
];

const goods = [
  "Оймс", "Түрий", "Өвдгөвч", "Улавч", "Бойтог", "Малгай", "Ороолт", "Хүзүүвч",
  "Бээлий", "Цамц", "Ханцуйгүй цамц/хүрэм", "Нуруувч", "Даашинз", "Өмд", "Богино өмд", "Банзал (юбка)",
];

const markets = [
  {
    title: "Гадаад зах зээл",
    rows: [
      ["Америк тив", "АНУ, Канад"],
      ["Ази тив", "БНХАУ, БНСУ, Япон, Казахстан, Сингапур"],
      ["Европ тив", "ОХУ, ХБНГУ, Их Британи, Швейцар, Франц, Нидерланд, Бельги, Польш, Словак"],
    ],
  },
  {
    title: "Дотоод зах зээл",
    rows: [
      ["Улаанбаатар хот", "Үндсэн 16 нэрийн дэлгүүр, Томоохон зах худалдааны төвүүдээр"],
      ["Хөдөө орон нутаг", "Үндсэн Эрдэнэт хот 1, Дархан хот 1 нэрийн дэлгүүр, Орон нутгийн бөөний болон жижиглэн худалдаа эрхлэгч"],
      ["Хамтран ажиллагч байгууллага", "Номин сүлжээ дэлгүүр, И-март, BSB хүнс дэлгүүр, М март, CU"],
    ],
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
        {story.map((block) => (
          <section key={block.title}>
            <h2 className="about-value-title">{block.title}</h2>
            {block.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
      </div>
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

      <section className="about-quality">
        <h2 className="about-objectives-title">Чанар, стандарт ба баталгаажуулалт</h2>
        <p>
          Бид үйлдвэрлэлдээ Олон Улсын болон Үндэсний стандарт, хариуцлагатай, тогтвортой
          үйлдвэрлэлийн зарчмыг эрхэмлэн ажилладаг.
        </p>
        <ul className="about-certs">
          {certificates.map((c) => (
            <li key={c.src}>
              <Image src={c.src} alt={c.alt} fill sizes="(max-width: 760px) 45vw, 18vw" />
            </li>
          ))}
        </ul>
      </section>

      <div className="about-purpose about-purpose--one">
        {production.map((p) => (
          <section key={p.title}>
            <h2 className="about-value-title">{p.title}</h2>
            <p>{p.text}</p>
          </section>
        ))}
      </div>

      <h2 className="about-objectives-title">Үйлдвэрлэлийн шат дамжлага</h2>
      <ol className="about-steps">
        {steps.map((step, i) => (
          <li key={i}>
            <div className="about-step-photo">
              <Image
                src={`/images/steps/${String(i + 1).padStart(2, "0")}.png`}
                alt=""
                fill
                sizes="(max-width: 1100px) 40vw, 12vw"
              />
            </div>
            <span className="about-step-no">{String(i + 1).padStart(2, "0")}</span>
            {step}
          </li>
        ))}
      </ol>

      <h2 className="about-objectives-title">Борлуулалтын үйл ажиллагаа</h2>
      <p className="about-goods-lead">Борлуулж байгаа барааны нэр төрөл ({goods.length})</p>
      <ul className="about-goods">
        {goods.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
      <div className="about-purpose about-purpose--two">
        {markets.map((m) => (
          <section key={m.title}>
            <h2 className="about-value-title">{m.title}</h2>
            <dl className="about-markets">
              {m.rows.map(([where, what]) => (
                <div key={where}>
                  <dt>{where}</dt>
                  <dd>{what}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      {/* Animated map of the domestic market; the lines draw in once it loads. */}
      <div className="about-map">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/mongolia-map-animated.svg" alt="Монгол дахь борлуулалтын сүлжээ" loading="lazy" />
      </div>
    </article>
  );
}
