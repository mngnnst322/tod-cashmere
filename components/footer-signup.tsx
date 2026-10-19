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
            placeholder={t.note}
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
        <a href="#" aria-label="Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="filled">
            <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.1l.4-3H13V9c0-.6.4-1 1-1Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
