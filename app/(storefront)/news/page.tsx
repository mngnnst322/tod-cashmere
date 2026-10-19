import { NewsStrip } from "@/components/news-strip";

export const metadata = { title: "Мэдээ, мэдээлэл – Tod Cashmere" };

// All news posts from Admin → Мэдээ; linked from the footer.
export default function NewsListPage() {
  return <NewsStrip />;
}
