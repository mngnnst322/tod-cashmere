import { getDict } from "@/lib/i18n-server";
import { FooterSignup } from "./footer-signup";

export async function SiteFooter() {
  const { dict } = await getDict();
  return (
    <footer>
      <FooterSignup />
      <div className="footer-inner">
        <div>
          <div className="footer-brand">TOD CASHMERE</div>
          <p className="footer-text">
            {dict.footerBlurb}
          </p>
          <a className="section-link" href="#">
            {dict.footerFindStore}
          </a>
        </div>
        {/* The help links that used to be a home page section. */}
        {dict.infoColumns.map((col) => (
          <div key={col.title}>
            <div className="footer-column-title">{col.title}</div>
            <ul className="footer-links">
              {col.links.map((link) => (
                <li key={link}>
                  <a href={/нууцлал|privacy|конфиденц|隐私/i.test(link) ? "/privacy" : "#"}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom container">
        <div>© 2026 Tod Cashmere</div>
      </div>
    </footer>
  );
}
