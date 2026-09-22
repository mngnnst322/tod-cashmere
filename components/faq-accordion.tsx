"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Ноолуур чинь хаанаас гаралтай вэ?",
    a: "Бүх түүхий эд маань Монголын говийн бүсэд өсгөсөн тэмээн хяналтаас гаралтай бөгөөд 16 микроноос нарийн ширхэгтэй сонгомол ноолуур юм.",
  },
  {
    q: "Хүргэлт хэр хугацаанд хийгддэг вэ?",
    a: "Улаанбаатар хотод 1-2 ажлын өдөр, орон нутаг болон олон улсад 5-10 ажлын өдөрт хүргэнэ. 500,000₮-өөс дээш захиалгад хүргэлт үнэгүй.",
  },
  {
    q: "Ноолууран хувцсаа яаж арчлах вэ?",
    a: "Гар угаалга эсвэл ноолуурын зөөлөн горимоор 30°C-аас доош хэмд угаана. Хавтгай хатааж, гангаар бус уураар индүүднэ.",
  },
  {
    q: "Буцаалт, солилтын нөхцөл юу вэ?",
    a: "Бараа хүлээн авснаас хойш 14 хоногийн дотор шошго бүрэн, ашиглаагүй тохиолдолд буцаалт, солилт хийнэ.",
  },
  {
    q: "Хэмжээгээ хэрхэн сонгох вэ?",
    a: "Бүтээгдэхүүн бүрийн хуудсанд хэмжээний хүснэгт бий. Эргэлзвэл хоёр хэмжээний дунд бол том хэмжээг сонгохыг зөвлөж байна.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="faq-list container">
      {faqs.map((item, index) => (
        <div
          className={`faq-item ${openIndex === index ? "open" : ""}`}
          key={item.q}
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
