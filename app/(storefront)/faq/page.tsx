import { FaqAccordion } from "@/components/faq-accordion";
import { getDict } from "@/lib/i18n-server";

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.faqTitle} – Tod Cashmere` };
}

// Frequently asked questions, linked from the footer.
export default async function FaqPage() {
  const { dict } = await getDict();
  return (
    <section className="section faq" id="faq">
      <div className="section-header">
        <div>
          <div className="section-title">{dict.faqTitle}</div>
          <div className="section-subtitle">{dict.faqSubtitle}</div>
        </div>
      </div>
      <FaqAccordion />
    </section>
  );
}
