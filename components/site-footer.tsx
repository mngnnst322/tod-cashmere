import { getLang } from "@/lib/i18n-server";
import type { Lang } from "@/lib/i18n";
import { FooterSignup } from "./footer-signup";
import { ScrollTopButton } from "./scroll-top-button";

type Column = { title: string; links: { label: string; href: string }[] };

const columns: Record<Lang, Column[]> = {
  mn: [
    {
      title: "Мэдээ, мэдээлэл",
      links: [
        { label: "Бидний тухай", href: "#" },
        { label: "Мэдээ", href: "#" },
        { label: "Ажлын байр", href: "#" },
      ],
    },
    {
      title: "Үйлчилгээ",
      links: [
        { label: "Үйлчилгээний нөхцөл", href: "#" },
        { label: "Нууцлалын бодлого", href: "/privacy" },
        { label: "Хүргэлт, буцаалтын нөхцөл", href: "#" },
        { label: "Бэлгийн карт", href: "#" },
      ],
    },
    {
      title: "Хэрэглэгчийн туслах",
      links: [
        { label: "Түгээмэл асуулт, хариулт", href: "/#faq" },
        { label: "Бүтээгдэхүүний арчилгаа", href: "#" },
        { label: "Сэтгэгдэл илгээх", href: "mailto:todcashmere@gmail.com" },
        { label: "Онлайн захиалгын заавар", href: "#" },
      ],
    },
  ],
  en: [
    {
      title: "News & info",
      links: [
        { label: "About us", href: "#" },
        { label: "News", href: "#" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      title: "Service",
      links: [
        { label: "Terms of service", href: "#" },
        { label: "Privacy policy", href: "/privacy" },
        { label: "Delivery & returns", href: "#" },
        { label: "Gift card", href: "#" },
      ],
    },
    {
      title: "Customer help",
      links: [
        { label: "FAQ", href: "/#faq" },
        { label: "Product care", href: "#" },
        { label: "Send feedback", href: "mailto:todcashmere@gmail.com" },
        { label: "How to order online", href: "#" },
      ],
    },
  ],
  ru: [
    {
      title: "Новости",
      links: [
        { label: "О нас", href: "#" },
        { label: "Новости", href: "#" },
        { label: "Вакансии", href: "#" },
      ],
    },
    {
      title: "Сервис",
      links: [
        { label: "Условия обслуживания", href: "#" },
        { label: "Политика конфиденциальности", href: "/privacy" },
        { label: "Доставка и возврат", href: "#" },
        { label: "Подарочная карта", href: "#" },
      ],
    },
    {
      title: "Покупателям",
      links: [
        { label: "Частые вопросы", href: "/#faq" },
        { label: "Уход за изделиями", href: "#" },
        { label: "Оставить отзыв", href: "mailto:todcashmere@gmail.com" },
        { label: "Как заказать онлайн", href: "#" },
      ],
    },
  ],
  zh: [
    {
      title: "新闻资讯",
      links: [
        { label: "关于我们", href: "#" },
        { label: "新闻", href: "#" },
        { label: "招聘", href: "#" },
      ],
    },
    {
      title: "服务",
      links: [
        { label: "服务条款", href: "#" },
        { label: "隐私政策", href: "/privacy" },
        { label: "配送与退货", href: "#" },
        { label: "礼品卡", href: "#" },
      ],
    },
    {
      title: "客户帮助",
      links: [
        { label: "常见问题", href: "/#faq" },
        { label: "产品护理", href: "#" },
        { label: "发送反馈", href: "mailto:todcashmere@gmail.com" },
        { label: "在线订购指南", href: "#" },
      ],
    },
  ],
};

const contact: Record<Lang, { title: string; stores: string; rights: string }> =
  {
    mn: {
      title: "Холбоо барих",
      stores: "Салбар дэлгүүрийн байршил",
      rights: "Бүх эрх хуулиар хамгаалагдсан.",
    },
    en: {
      title: "Contact",
      stores: "Store locations",
      rights: "All rights reserved.",
    },
    ru: {
      title: "Контакты",
      stores: "Адреса магазинов",
      rights: "Все права защищены.",
    },
    zh: { title: "联系我们", stores: "门店位置", rights: "版权所有。" },
  };

// TODO(owner): add the shop's phone number and address to the contact column.
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
            <li>
              <a href="mailto:todcashmere@gmail.com">todcashmere@gmail.com</a>
            </li>
            <li>
              <a href="#">{c.stores}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bar">© 2026 Tod Cashmere. {c.rights}</div>
      <ScrollTopButton />
    </footer>
  );
}
