"use client";

import { useState } from "react";
import { useLang } from "./lang-provider";

export function FaqAccordion() {
  const { dict } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="faq-list container">
      {dict.faqs.map((item, index) => (
        <div
          className={`faq-item ${openIndex === index ? "open" : ""}`}
          key={index}
        >
          <button
            type="button"
            className="faq-q"
            aria-expanded={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="faq-q-text">{item.q}</span>
            <span className="faq-icon" aria-hidden="true"></span>
          </button>
          <div className="faq-a">
            <div className="faq-a-inner">{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
