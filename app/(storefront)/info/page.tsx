export const metadata = { title: "Info – Tod Cashmere" };

const columns = [
  {
    title: "Бидний тухай",
    links: [
      "Tod Cashmere-ийн тухай",
      "Дэлгүүрийн байршил",
      "Ноолуур арчилгаа",
    ],
  },
  {
    title: "Үйлчилгээний нөхцөл",
    links: [
      "Үйлчилгээний нөхцөл",
      "Бүртгэл, Хүргэлтийн нөхцөл",
      "Нууцлалын баталгаа",
      "Буцаах, Солих Журам",
    ],
  },
  {
    title: "Хувьцаа эзэмшигчдэд",
    links: [
      "Компанийн засаглал",
      "Төлөөлөн удирдах зөвлөл",
      "Гүйцэтгэх удирдлага",
      "Ногдол ашиг",
      "Мэдээ, мэдээлэл",
    ],
  },
];

export default function InfoPage() {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">Туслах холбоосууд</div>
          <div className="section-subtitle">Support, policy, investor info</div>
        </div>
      </div>
      <div className="info-grid">
        {columns.map((col) => (
          <div className="info-card" key={col.title}>
            <div className="info-title">{col.title}</div>
            <ul className="info-list">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
