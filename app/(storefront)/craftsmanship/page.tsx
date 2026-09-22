export const metadata = { title: "Craftsmanship – Tod Cashmere" };

export default function CraftsmanshipPage() {
  return (
    <section className="section craftsmanship">
      <div className="container craftsmanship-inner">
        <div>
          <div className="section-title">Ноолуурын ур дүй</div>
          <div className="section-subtitle">Чанар, арчилгааны тухай товч</div>
          <p className="craftsmanship-text" style={{ marginTop: 12 }}>
            Tod Cashmere нь гэр бүлийн жижиг үйлдвэрийн урам зоригтойгоор
            эхэлсэн бөгөөд өнөөдөр ч гэсэн хүний гарын дулаанаар хийсэн хэсэг
            бүрийг чанд нягталдаг.
          </p>
        </div>
        <div className="craftsmanship-list">
          <div className="craftsmanship-item">
            <div className="craftsmanship-label">Hand Finished</div>
            <p className="craftsmanship-desc">
              Тус бүрийг гараар дуусгаж, материалын уян зөөлөн уналтыг хэвээр
              хадгалдаг.
            </p>
          </div>
          <div className="craftsmanship-item">
            <div className="craftsmanship-label">Traceable Fiber</div>
            <p className="craftsmanship-desc">
              Түүхий эд бүрийг хамтран ажилладаг малчдаас гаралтайг
              баталгаажуулна.
            </p>
          </div>
          <div className="craftsmanship-item">
            <div className="craftsmanship-label">Lifetime Aftercare</div>
            <p className="craftsmanship-desc">
              Бүх салбарт үнэгүй үсэрхийлтийн үйлчилгээ, уураар арчилгаа.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
