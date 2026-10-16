import { getDict } from "@/lib/i18n-server";

export async function SiteFooter() {
  const { dict } = await getDict();
  return (
    <footer>
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
        <div>
          <div className="footer-column-title">{dict.footerCompany}</div>
          <ul className="footer-links">
            <li>
              <a href="#">{dict.footerAbout}</a>
            </li>
            <li>
              <a href="#">{dict.footerCareers}</a>
            </li>
            <li>
              <a href="#">{dict.footerPress}</a>
            </li>
            <li>
              <a href="#">{dict.footerStores}</a>
            </li>
          </ul>
        </div>
        <div>
          <div className="footer-column-title">{dict.footerHelp}</div>
          <ul className="footer-links">
            <li>
              <a href="#">{dict.footerShipping}</a>
            </li>
            <li>
              <a href="#">{dict.footerReturns}</a>
            </li>
            <li>
              <a href="#">{dict.footerContact}</a>
            </li>
          </ul>
        </div>
        <div>
          <div className="footer-column-title">{dict.footerLegal}</div>
          <ul className="footer-links">
            <li>
              <a href="#">{dict.footerTerms}</a>
            </li>
            <li>
              <a href="/privacy">{dict.footerPrivacy}</a>
            </li>
            <li>
              <a href="#">{dict.footerCookies}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        <div>© 2026 Tod Cashmere</div>
        <div className="footer-social">
          <a href="#" aria-label="Instagram">
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 12 10.5Zm4.75-3.75a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h2.1l.4-3H13v-2c0-.6.4-1 1-1Z" />
            </svg>
          </a>
          <a href="#" aria-label="X / Twitter">
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 5h4.3l3 4.3L14.8 5H20l-6 7.2L20 19h-4.3l-3.4-4.5L8.8 19H4l6.4-7.4Z" />
            </svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.6 7.2a2 2 0 0 0-1.4-1.5C17.7 5.4 12 5.4 12 5.4s-5.7 0-7.2.3A2 2 0 0 0 3.4 7.2 20.8 20.8 0 0 0 3.1 12a20.8 20.8 0 0 0 .3 4.8 2 2 0 0 0 1.4 1.5c1.5.3 7.2.3 7.2.3s5.7 0 7.2-.3a2 2 0 0 0 1.4-1.5 20.8 20.8 0 0 0 .3-4.8 20.8 20.8 0 0 0-.3-4.8ZM10 14.7V9.3l4.3 2.7Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
