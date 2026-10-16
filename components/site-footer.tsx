import { getLang } from "@/lib/i18n-server";
import type { Lang } from "@/lib/i18n";
import { FooterSignup } from "./footer-signup";
import { ScrollTopButton } from "./scroll-top-button";

type Column = { title: string; links: { label: string; href: string }[] };

const ADDRESS = {
  mn: "“ТОД кашмер” үйлдвэрийн байр, 20-р хороо, Баянгол дүүрэг, Улаанбаатар хот",
  en: "“TOD Cashmere” factory building, 20th khoroo, Bayangol district, Ulaanbaatar",
  ru: "Фабрика «ТОД кашмер», 20-й хороо, Баянгольский район, Улан-Батор",
  zh: "“TOD 羊绒”工厂大楼，乌兰巴托市巴音高勒区第20分区",
};
const PHONE = "+976 80310023";
const EMAIL = "todcashmere@gmail.com";

const columns: Record<Lang, Column[]> = {
  mn: [
    {
      title: "Бидний тухай",
      links: [
        { label: "Бидний тухай", href: "#" },
        { label: "Дэлгүүрийн байршил — Тод оймсын төв салбар", href: "#" },
        { label: "Ноолуур арчилгаа", href: "#" },
      ],
    },
    {
      title: "Хэрэглэгчийн үйлчилгээ",
      links: [
        { label: "Түгээмэл асуулт, хариулт", href: "/faq" },
        { label: "Бэлгийн карт", href: "#" },
        { label: "Санал хүсэлт", href: `mailto:${EMAIL}` },
        { label: "Миний захиалгууд", href: "/account" },
      ],
    },
  ],
  en: [
    {
      title: "About us",
      links: [
        { label: "About us", href: "#" },
        { label: "Store — Tod socks main branch", href: "#" },
        { label: "Cashmere care", href: "#" },
      ],
    },
    {
      title: "Customer service",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Gift card", href: "#" },
        { label: "Feedback", href: `mailto:${EMAIL}` },
        { label: "My orders", href: "/account" },
      ],
    },
  ],
  ru: [
    {
      title: "О нас",
      links: [
        { label: "О нас", href: "#" },
        { label: "Магазин — главный филиал Tod", href: "#" },
        { label: "Уход за кашемиром", href: "#" },
      ],
    },
    {
      title: "Обслуживание",
      links: [
        { label: "Частые вопросы", href: "/faq" },
        { label: "Подарочная карта", href: "#" },
        { label: "Отзывы и предложения", href: `mailto:${EMAIL}` },
        { label: "Мои заказы", href: "/account" },
      ],
    },
  ],
  zh: [
    {
      title: "关于我们",
      links: [
        { label: "关于我们", href: "#" },
        { label: "门店 — Tod 袜子总店", href: "#" },
        { label: "羊绒护理", href: "#" },
      ],
    },
    {
      title: "客户服务",
      links: [
        { label: "常见问题", href: "/faq" },
        { label: "礼品卡", href: "#" },
        { label: "意见反馈", href: `mailto:${EMAIL}` },
        { label: "我的订单", href: "/account" },
      ],
    },
  ],
};

const contact: Record<Lang, { title: string; rights: string }> = {
  mn: {
    title: "Холбоо барих",
    rights: "© 2026 Тод кашмер ХХК. Бүх эрх хуулиар хамгаалагдсан.",
  },
  en: {
    title: "Contact",
    rights: "© 2026 Tod Cashmere LLC. All rights reserved.",
  },
  ru: {
    title: "Контакты",
    rights: "© 2026 ООО «Тод кашмер». Все права защищены.",
  },
  zh: {
    title: "联系我们",
    rights: "© 2026 Tod Cashmere 有限责任公司。版权所有。",
  },
};

export async function SiteFooter() {
  const lang = await getLang();
  const c = contact[lang];
  return (
    <footer>
      <FooterSignup />
      <div className="footer-columns">
        {columns[lang].map((col) => (
          <div key={col.title}>
            <div className="footer-column-title">{col.title}</div>
            <ul className="footer-links">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <div className="footer-column-title">{c.title}</div>
          <ul className="footer-links">
            <li>{ADDRESS[lang]}</li>
            <li>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bar">{c.rights}</div>
      <ScrollTopButton />
    </footer>
  );
}
