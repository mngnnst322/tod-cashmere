export const metadata = { title: "Lookbook – Tod Cashmere" };

const stories = [
  {
    image: "/images/front-view-woman-enjoying-time-beach.jpg",
    title: "Өвөрмөц 16 микрон ноолуур",
    excerpt:
      "Хүйтэн уур амьсгалд хорог суусан тэмээн хянганы соргог ноосны маш нарийн ширхэглэлтэй түүхий эд.",
    link: "Дэлгэрэнгүй →",
  },
  {
    image: "/images/woman-holding-coffee-cup-front-view.jpg",
    title: "Эко будаг, байгалийн өнгө",
    excerpt:
      "Ус хэмнэх шинэ будаглах технологи нь өнгийг удаан хадгалж, арьсанд зөөлөн мэдрэмж төрүүлдэг.",
    link: "Арчилгааны заавар →",
  },
];

export default function LookbookPage() {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">Lookbook &amp; Stories</div>
          <div className="section-subtitle">
            Арьс, материал, стилингийн санаа
          </div>
        </div>
      </div>
      <div className="story-grid container">
        {stories.map((story) => (
          <article className="story-card" key={story.title}>
            <div className="story-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={story.image} alt={story.title} loading="lazy" />
            </div>
            <div className="story-body">
              <div className="story-title">{story.title}</div>
              <p className="story-excerpt">{story.excerpt}</p>
              <a className="story-link" href="#">
                {story.link}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
