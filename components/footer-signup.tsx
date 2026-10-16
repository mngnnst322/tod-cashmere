"use client";

import Image from "next/image";
import { useState } from "react";
import { useLang } from "./lang-provider";

const text = {
  mn: {
    placeholder: "Имэйл хаяг",
    note: "Имэйлээ бүртгүүлээд шинэ бүтээгдэхүүн, хямдралын мэдээллийг хялбараар аваарай.",
    thanks: "Баярлалаа! Бид танд мэдээлэл илгээх болно.",
    send: "Илгээх",
  },
  en: {
    placeholder: "Email address",
    note: "Sign up to hear about new products and sales first.",
    thanks: "Thank you! We'll keep you posted.",
    send: "Send",
  },
  ru: {
    placeholder: "Email",
    note: "Подпишитесь, чтобы первыми узнавать о новинках и скидках.",
    thanks: "Спасибо! Мы будем держать вас в курсе.",
    send: "Отправить",
  },
  zh: {
    placeholder: "邮箱地址",
    note: "订阅以第一时间获取新品和折扣信息。",
    thanks: "谢谢！我们会及时通知您。",
    send: "发送",
  },
};

/** Top strip of the footer: logo, email sign-up and social links. */
export function FooterSignup() {
  const { lang } = useLang();
  const t = text[lang];
  const [done, setDone] = useState(false);

  return (
    <div className="footer-signup">
      <Image
        src="/images/web-logo-trim.png"
        alt="Tod Cashmere"
        width={836}
        height={932}
        className="footer-signup-logo"
      />
      <p className="footer-signup-note">{t.note}</p>
      {done ? (
        <p className="footer-signup-thanks">{t.thanks}</p>
      ) : (
        <form
          className="footer-signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <input
            type="email"
            required
            placeholder={t.placeholder}
            aria-label={t.placeholder}
          />
          <button type="submit" aria-label={t.send}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
            </svg>
          </button>
        </form>
      )}
      <div className="footer-signup-social">
        <a href="#" aria-label="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="0.9" className="fill" />
          </svg>
        </a>
        <a href="#" aria-label="WeChat">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="filled">
            <path d="M9.2 4C5.2 4 2 6.7 2 10c0 1.9 1 3.5 2.6 4.6L4 16.8l2.5-1.3c.8.2 1.7.4 2.7.4h.6a5.6 5.6 0 0 1-.2-1.5c0-3.3 3.1-5.9 7-5.9h.6C16.6 5.9 13.2 4 9.2 4Zm-2.4 3.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.8 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM16.6 9.6c-3.3 0-5.9 2.2-5.9 4.9s2.6 4.9 5.9 4.9c.7 0 1.4-.1 2-.3l2 1-.5-1.8c1.4-.9 2.3-2.3 2.3-3.8 0-2.7-2.6-4.9-5.8-4.9Zm-2 2.9a.8.8 0 1 1 0 1.5.8.8 0 0 1 0-1.5Zm4 0a.8.8 0 1 1 0 1.5.8.8 0 0 1 0-1.5Z" />
          </svg>
        </a>
        <a href="#" aria-label="Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="filled">
            <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.1l.4-3H13V9c0-.6.4-1 1-1Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
