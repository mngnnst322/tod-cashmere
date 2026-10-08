import { getDict } from "@/lib/i18n-server";

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.infoTitle} – Tod Cashmere` };
}

export default async function InfoPage() {
  const { dict } = await getDict();
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">{dict.infoTitle}</div>
          <div className="section-subtitle">{dict.infoSubtitle}</div>
        </div>
      </div>
      <div className="info-grid">
        {dict.infoColumns.map((col) => (
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
