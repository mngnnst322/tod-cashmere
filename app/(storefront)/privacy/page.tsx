export const metadata = { title: "Нууцлалын бодлого / Privacy Policy – Tod Cashmere" };

// Plain bilingual policy; also the privacy URL given to Google for sign-in.
export default function PrivacyPage() {
  return (
    <section className="section privacy-page">
      <article lang="mn">
        <h1>Нууцлалын бодлого</h1>
        <p className="privacy-updated">Шинэчилсэн: 2026 оны 10-р сар</p>
        <p>
          Tod Cashmere (todcashmere.com) таны хувийн мэдээллийг хүндэтгэн хамгаална. Энэ бодлого
          бид ямар мэдээлэл цуглуулж, хэрхэн ашигладгийг тайлбарлана.
        </p>
        <h2>Бидний цуглуулдаг мэдээлэл</h2>
        <ul>
          <li>
            <strong>Бүртгэл:</strong> нэр, имэйл хаяг. Google-ээр нэвтэрвэл Google таны нэр, имэйл,
            профайл зургийг бидэнд дамжуулна.
          </li>
          <li>
            <strong>Захиалга:</strong> захиалга хүргэхэд шаардлагатай нэр, утас, хаяг, захиалсан
            бараа.
          </li>
          <li>
            <strong>Төхөөрөмж дээр хадгалагдах мэдээлэл:</strong> сонгосон хэл, сагс, хадгалсан
            (зүрхэлсэн) бараа зэрэг нь таны хөтөч дээр хадгалагдана.
          </li>
        </ul>
        <h2>Мэдээллийг хэрхэн ашигладаг вэ</h2>
        <ul>
          <li>Таныг нэвтрүүлэх, бүртгэлийг тань удирдах</li>
          <li>Захиалгыг боловсруулж хүргэх, тантай холбогдох</li>
          <li>Сайтыг ажиллуулах, сайжруулах</li>
        </ul>
        <p>
          Бид таны мэдээллийг худалдахгүй, зар сурталчилгааны зорилгоор бусдад дамжуулахгүй.
          Нэвтрэлтийг Clerk, сайтын байршлыг Cloudflare үйлчилгээ хариуцдаг бөгөөд тэд зөвхөн
          эдгээр үйлчилгээг үзүүлэхэд шаардлагатай мэдээллийг боловсруулна.
        </p>
        <h2>Таны эрх</h2>
        <p>
          Та өөрийн мэдээллийг харах, засах, бүртгэлээ болон мэдээллээ устгуулахыг хүсэх эрхтэй.
          Доорх имэйлээр хандана уу.
        </p>
        <h2>Холбоо барих</h2>
        <p>
          <a href="mailto:todcashmere@gmail.com">todcashmere@gmail.com</a>
        </p>
      </article>

      <hr className="privacy-rule" />

      <article lang="en">
        <h1>Privacy Policy</h1>
        <p className="privacy-updated">Last updated: October 2026</p>
        <p>
          Tod Cashmere (todcashmere.com) respects your privacy. This policy explains what
          information we collect and how we use it.
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account:</strong> your name and email address. If you sign in with Google,
            Google shares your name, email address and profile picture with us.
          </li>
          <li>
            <strong>Orders:</strong> the name, phone number, address and items needed to deliver
            your order.
          </li>
          <li>
            <strong>Stored on your device:</strong> your chosen language, cart and saved
            (hearted) items are kept in your browser.
          </li>
        </ul>
        <h2>How we use it</h2>
        <ul>
          <li>To sign you in and manage your account</li>
          <li>To process and deliver orders and contact you about them</li>
          <li>To run and improve the website</li>
        </ul>
        <p>
          We do not sell your information or share it with others for advertising. Sign-in is
          provided by Clerk and hosting by Cloudflare; they process information only as needed to
          provide those services.
        </p>
        <h2>Your rights</h2>
        <p>
          You can ask to see or correct your information, or to delete your account and data, by
          emailing us.
        </p>
        <h2>Contact</h2>
        <p>
          <a href="mailto:todcashmere@gmail.com">todcashmere@gmail.com</a>
        </p>
      </article>
    </section>
  );
}
