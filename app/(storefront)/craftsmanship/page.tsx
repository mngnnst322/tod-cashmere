import { getDict } from "@/lib/i18n-server";

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.craftTitle} – Tod Cashmere` };
}

export default async function CraftsmanshipPage() {
  const { dict } = await getDict();
  return (
    <section className="section craftsmanship">
      <div className="container craftsmanship-inner">
        <div>
          <div className="section-title">{dict.craftTitle}</div>
          <div className="section-subtitle">{dict.craftSubtitle}</div>
          <p className="craftsmanship-text" style={{ marginTop: 12 }}>
            {dict.craftText}
          </p>
        </div>
        <div className="craftsmanship-list">
          {dict.craftItems.map((item) => (
            <div className="craftsmanship-item" key={item.label}>
              <div className="craftsmanship-label">{item.label}</div>
              <p className="craftsmanship-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
