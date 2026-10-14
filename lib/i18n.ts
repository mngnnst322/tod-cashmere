export type Lang = "mn" | "en" | "ru" | "zh";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "mn", label: "Монгол" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "zh", label: "中文" },
];

export const DEFAULT_LANG: Lang = "mn";

export function isLang(value: unknown): value is Lang {
  return value === "mn" || value === "en" || value === "ru" || value === "zh";
}

/** Fills `{name}` placeholders in a dictionary string. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

const mn = {
  // Navigation
  women: "Эмэгтэй",
  men: "Эрэгтэй",
  sale: "Хямдрал",
  newArrivals: "Шинэ бараа",
  lookbook: "Lookbook",
  bundle: "Багц",
  openMenu: "Цэс нээх",
  toggleTheme: "Өнгөний горим солих",
  selectLanguage: "Хэл сонгох",
  search: "Хайх",
  searchPlaceholder: "Tod Cashmere-аас хайх...",
  close: "Хаах",
  cart: "Сагс",
  viewAll: "Бүгдийг харах",

  // Mega menu
  megaNew: "Шинэ бараа",
  megaEssentials: "Гол бараа",
  megaBestsellers: "Шилдэг борлуулалт",
  megaTops: "Цамц",
  megaSweaters: "Свитр",
  megaCardigans: "Кардиган",
  megaHoodies: "Малгайтай цамц",
  megaDresses: "Даашинз",
  megaAccessories: "Аксессуар",
  megaBeanies: "Малгай",
  megaScarves: "Ороолт & Шаль",
  megaGloves: "Бээлий",
  megaShoes: "Гутал",
  megaOuterwear: "Гадуур хувцас",
  megaCoats: "Пальто",
  megaBlazers: "Блэйзер",
  megaJackets: "Куртка",
  megaCollection: "Коллекц",
  megaCollectionCaption: "Хавар–Зун 2026",
  megaSale: "Хямдрал",
  megaSaleWomen: "Эмэгтэй хямдрал",
  megaSaleMen: "Эрэгтэй хямдрал",

  // Account
  login: "Нэвтрэх",
  signUp: "Бүртгүүлэх",
  profile: "Профайл",
  admin: "Админ",
  signOut: "Гарах",
  account: "Бүртгэл",
  signInSubtitle: "Бүртгэлдээ нэвтэрнэ үү",
  signUpSubtitle: "Шинэ бүртгэл үүсгэх",
  name: "Нэр",
  email: "Имэйл",
  password: "Нууц үг",
  passwordHint: "8-аас дээш тэмдэгт",
  pleaseWait: "Түр хүлээнэ үү...",
  noAccount: "Бүртгэлгүй юу?",
  haveAccount: "Бүртгэлтэй юу?",
  authError: "Нэвтрэхэд алдаа гарлаа.",
  profileSubtitle: "Таны бүртгэлийн мэдээлэл",
  role: "Эрх",
  roleAdmin: "Админ",
  roleUser: "Хэрэглэгч",
  memberSince: "Бүртгүүлсэн огноо",
  openAdmin: "Админ самбар руу орох",

  // Product cards & detail
  addToCart: "Сагсанд хийх",
  added: "Нэмэгдлээ ✓",
  outOfStock: "Дууссан",
  shopCategory: "{name} үзэх →",
  productCode: "Барааны код",
  collection: "Цуглуулга",
  collectionCatalog: "Каталог",
  collectionArrival: "Шинэ ирэлт",
  relatedTitle: "Танд таалагдаж магадгүй",
  relatedSubtitle: "Төстэй бүтээгдэхүүнүүд",
  badges: {
    Эрэгтэй: "Эрэгтэй",
    "Гадуур хувцас": "Гадуур хувцас",
    "Гол бараа": "Гол бараа",
    Шинэ: "Шинэ",
    Хямдрал: "Хямдрал",
    Онцлох: "Онцлох",
  } as Record<string, string>,

  // Home & listing pages
  introEyebrow: "Монгол говийн ноолуур",
  introTitle1: "Арьсанд зориулсан",
  introTitle2: "инженерчлэлийн зөөлөн.",
  introLead:
    "16 микроноос нарийн ширхэгт, гар түүврийн ноолуур. Улирал бүрд тансаг, өдөр бүрд эвтэйхэн.",
  categoriesTitle: "Бүтээгдэхүүний төрөл",
  categoriesSubtitle: "Ангиллаар үзэх",
  featuredTitle: "Онцлох бараа",
  featuredSubtitle: "Манай багийн шилдэг сонголт",
  catalogHighlights: "Каталогийн шилдэг бараа",
  saleTitle: "Ноолууран гутал",
  saleSubtitle: "Tod Cashmere-ийн онцлох хямдрал",
  arrivalsTitle: "Шинэ бүтээгдэхүүн",
  arrivalsSubtitle: "Шинэ силуэт, лимит капсул",
  lookbookTitle: "Lookbook ба түүхүүд",
  lookbookSubtitle: "Арьс, материал, стилингийн санаа",
  stories: [
    {
      title: "Өвөрмөц 16 микрон ноолуур",
      excerpt:
        "Хүйтэн уур амьсгалд хорог суусан тэмээн хянганы соргог ноосны маш нарийн ширхэглэлтэй түүхий эд.",
      link: "Дэлгэрэнгүй →",
    },
    {
      title: "Эко будаг, байгалийн өнгө",
      excerpt:
        "Ус хэмнэх шинэ будаглах технологи нь өнгийг удаан хадгалж, арьсанд зөөлөн мэдрэмж төрүүлдэг.",
      link: "Арчилгааны заавар →",
    },
  ],
  craftTitle: "Ноолуурын ур дүй",
  craftSubtitle: "Чанар, арчилгааны тухай товч",
  craftCta: "Каталог үзэх",
  craftText:
    "Tod Cashmere нь гэр бүлийн жижиг үйлдвэрийн урам зоригтойгоор эхэлсэн бөгөөд өнөөдөр ч гэсэн хүний гарын дулаанаар хийсэн хэсэг бүрийг чанд нягталдаг.",
  craftItems: [
    {
      label: "Гар аргаар дуусгасан",
      desc: "Тус бүрийг гараар дуусгаж, материалын уян зөөлөн уналтыг хэвээр хадгалдаг.",
    },
    {
      label: "Гарал үүсэл тодорхой ширхэг",
      desc: "Түүхий эд бүрийг хамтран ажилладаг малчдаас гаралтайг баталгаажуулна.",
    },
    {
      label: "Насан туршийн арчилгаа",
      desc: "Бүх салбарт үнэгүй үсэрхийлтийн үйлчилгээ, уураар арчилгаа.",
    },
  ],
  infoTitle: "Туслах холбоосууд",
  infoSubtitle: "Тусламж, журам, хөрөнгө оруулагчдад",
  infoColumns: [
    {
      title: "Бидний тухай",
      links: ["Tod Cashmere-ийн тухай", "Дэлгүүрийн байршил", "Ноолуур арчилгаа"],
    },
    {
      title: "Үйлчилгээний нөхцөл",
      links: [
        "Үйлчилгээний нөхцөл",
        "Бүртгэл, Хүргэлтийн нөхцөл",
        "Нууцлалын баталгаа",
        "Буцаах, Солих Журам",
      ],
    },
    {
      title: "Хувьцаа эзэмшигчдэд",
      links: [
        "Компанийн засаглал",
        "Төлөөлөн удирдах зөвлөл",
        "Гүйцэтгэх удирдлага",
        "Ногдол ашиг",
        "Мэдээ, мэдээлэл",
      ],
    },
  ],
  faqTitle: "Түгээмэл асуултууд",
  faqSubtitle: "Ноолуур, хүргэлт, арчилгааны талаар",
  faqs: [
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
  ],
  newsletterTitle: "Мэдээлэл авч байх",
  newsletterSubtitle:
    "Шинэ бүтээгдэхүүн, хямдралын мэдээллийг түргэн авч байгаарай",
  newsletterText:
    "Имэйлээ бүртгүүлээд Tod Cashmere-ийн шинэ бүтээгдэхүүн, хямдралын мэдээллийг түргэн шуурхай аваарай.",
  emailPlaceholder: "Имэйл хаяг",
  subscribe: "Бүртгүүлэх",

  // Search
  searchTitle: "Хайлт",
  searchResults: '"{query}" — {count} үр дүн',
  searchPrompt: "Хайх үгээ оруулна уу",

  // Cart & checkout
  cartCount: "{count} бараа сагсанд байна",
  cartEmpty: "Таны сагс хоосон байна.",
  total: "Нийт дүн",
  shippingInfo: "Хүргэлтийн мэдээлэл",
  fullName: "Овог нэр",
  phone: "Утасны дугаар",
  address: "Хаяг",
  paymentMethod: "Төлбөрийн арга",
  card: "Карт",
  processingPayment: "Төлбөр шалгаж байна...",
  placeOrder: "Демо захиалга хийх",
  orderSuccess: "Demo төлбөр амжилттай. Захиалга бүртгэгдлээ.",
  orderConfirmed: "Захиалга баталгаажлаа",
  orderNumber: "Захиалгын дугаар: {id}",

  // Bundle configurator
  bundleEyebrow: "Төрх 04 · Намрын ателье",
  bundleTitle: "Нам гүм илэрхийлэл",
  bundleIntro:
    "Хүссэн хувцсаа сонгох эсвэл бүтэн төрхийг хамгийн таатай үнээр аваарай.",
  bundleImageAlt: "Ателье багцын таван хувцастай загвар өмсөгч",
  bundleCity: "Улаанбаатар · 2026",
  bundleEditTitle: "Төрхөө бүрдүүлэх",
  selectAll: "Бүгдийг сонгох",
  selected: "сонгосон",
  bundlePricing: "Багцын үнэ",
  tierNone: "Бараа тус бүрийн үнэ",
  hintNone: "Багцын үнэ авахын тулд 3-аас дээш бараа сонгоно уу.",
  tierFull: "Бүтэн төрхийн үнэ · 20% хямд",
  hintFull: "5 бараатай бүтэн төрхөөс 20% хэмнээрэй.",
  tierPartial: "Сонголтын үнэ · 12% хямд",
  hintPartial: "3-аас дээш бараа сонгоод 12% хэмнээрэй.",
  subtotal: "Барааны нийт",
  savings: "Таны хэмнэлт",
  bundleTotal: "Багцын нийт",
  addBundle: "Сонгосон багцыг сагслах",
  bundleAdded: "Багц сагсанд нэмэгдлээ",
  lookItems: [
    {
      title: "Ноолуур хосолсон урт пальто",
      detail1: "Хар саарал · M размер",
      detail2: "Самнасан гадарга · дотортой",
    },
    {
      title: "Зөөлөн ноолууран өндөр захт",
      detail1: "Дулаан зааны яс · M размер",
      detail2: "16 микрон · сул загвар",
    },
    {
      title: "Өргөн эсгүүртэй өмд",
      detail1: "Зэс хүрэн · 38 размер",
      detail2: "Зөөлөн эсгүүр · урт загвар",
    },
    {
      title: "Хөнгөн ноолууран ороолт",
      detail1: "Мөөгөн бор · Нэг размер",
      detail2: "Цэвэр ноолуур · 180 × 40 см",
    },
    {
      title: "Арьсан шагайн гутал",
      detail1: "Эспрессо хүрэн · 38 размер",
      detail2: "Тугалын арьс · 55 мм өсгий",
    },
  ],

  // Footer
  footerBlurb: "Анхааралтай урласан дээд зэрэглэлийн Монгол ноолуур.",
  footerFindStore: "Ойролцоох дэлгүүр олох →",
  footerCompany: "Компани",
  footerHelp: "Тусламж",
  footerLegal: "Эрх зүй",
  footerAbout: "Tod Cashmere-ийн тухай",
  footerCareers: "Ажлын байр",
  footerPress: "Хэвлэл мэдээлэл",
  footerStores: "Дэлгүүрийн байршил",
  footerShipping: "Хүргэлт",
  footerReturns: "Буцаалт",
  footerContact: "Холбоо барих",
  footerTerms: "Үйлчилгээний нөхцөл",
  footerPrivacy: "Нууцлал",
  footerCookies: "Күүки",
};

export type Dict = typeof mn;

const en: Dict = {
  women: "Women",
  men: "Men",
  sale: "Sale",
  newArrivals: "New Arrivals",
  lookbook: "Lookbook",
  bundle: "Bundle",
  openMenu: "Open menu",
  toggleTheme: "Toggle dark mode",
  selectLanguage: "Select language",
  search: "Search",
  searchPlaceholder: "Search Tod Cashmere...",
  close: "Close",
  cart: "Cart",
  viewAll: "View all",

  megaNew: "New in",
  megaEssentials: "Essentials",
  megaBestsellers: "Best sellers",
  megaTops: "Tops",
  megaSweaters: "Sweaters",
  megaCardigans: "Cardigans",
  megaHoodies: "Hoodies",
  megaDresses: "Dresses",
  megaAccessories: "Accessories",
  megaBeanies: "Beanies",
  megaScarves: "Scarves & Wraps",
  megaGloves: "Gloves",
  megaShoes: "Shoes",
  megaOuterwear: "Outerwear",
  megaCoats: "Coats",
  megaBlazers: "Blazers",
  megaJackets: "Jackets",
  megaCollection: "Collection",
  megaCollectionCaption: "Spring–Summer 2026",
  megaSale: "Sale",
  megaSaleWomen: "Women's sale",
  megaSaleMen: "Men's sale",

  login: "Sign in",
  signUp: "Sign up",
  profile: "Profile",
  admin: "Admin",
  signOut: "Sign out",
  account: "Account",
  signInSubtitle: "Sign in to your account",
  signUpSubtitle: "Create a new account",
  name: "Name",
  email: "Email",
  password: "Password",
  passwordHint: "At least 8 characters",
  pleaseWait: "Please wait...",
  noAccount: "Don't have an account?",
  haveAccount: "Already have an account?",
  authError: "Something went wrong. Please try again.",
  profileSubtitle: "Your account details",
  role: "Role",
  roleAdmin: "Administrator",
  roleUser: "Customer",
  memberSince: "Member since",
  openAdmin: "Open admin panel",

  addToCart: "Add to Cart",
  added: "Added ✓",
  outOfStock: "Sold Out",
  shopCategory: "Shop {name} →",
  productCode: "Product code",
  collection: "Collection",
  collectionCatalog: "Catalog",
  collectionArrival: "New arrival",
  relatedTitle: "More to explore",
  relatedSubtitle: "Similar products",
  badges: {
    Эрэгтэй: "Men",
    "Гадуур хувцас": "Outerwear",
    "Гол бараа": "Essential",
    Шинэ: "New",
    Хямдрал: "Sale",
    Онцлох: "Featured",
  },

  introEyebrow: "Mongolian Gobi cashmere",
  introTitle1: "Softness,",
  introTitle2: "engineered for skin.",
  introLead:
    "Hand-combed cashmere finer than 16 microns. Luxurious every season, comfortable every day.",
  categoriesTitle: "Product categories",
  categoriesSubtitle: "Browse by category",
  featuredTitle: "Featured",
  featuredSubtitle: "Our team's top picks",
  catalogHighlights: "Catalog highlights",
  saleTitle: "Cashmere footwear",
  saleSubtitle: "Tod Cashmere's featured sale",
  arrivalsTitle: "New Arrivals",
  arrivalsSubtitle: "New silhouettes, limited capsules",
  lookbookTitle: "Lookbook & Stories",
  lookbookSubtitle: "Ideas on texture, materials and styling",
  stories: [
    {
      title: "Exceptional 16-micron cashmere",
      excerpt:
        "An exceptionally fine raw fiber, grown by herds hardened by a harsh, cold climate.",
      link: "Read more →",
    },
    {
      title: "Eco dyes, natural colors",
      excerpt:
        "A new water-saving dyeing process keeps colors lasting longer and feels gentle on the skin.",
      link: "Care guide →",
    },
  ],
  craftTitle: "Cashmere craftsmanship",
  craftSubtitle: "A short note on quality and care",
  craftCta: "View catalog",
  craftText:
    "Tod Cashmere began with the passion of a small family workshop, and to this day every piece made by hand is carefully inspected.",
  craftItems: [
    {
      label: "Hand Finished",
      desc: "Each piece is finished by hand to preserve the fabric's soft, supple drape.",
    },
    {
      label: "Traceable Fiber",
      desc: "Every batch of raw fiber is verified as coming from the herders we partner with.",
    },
    {
      label: "Lifetime Aftercare",
      desc: "Free de-pilling and steam care at every store.",
    },
  ],
  infoTitle: "Helpful links",
  infoSubtitle: "Support, policy, investor info",
  infoColumns: [
    {
      title: "About us",
      links: ["About Tod Cashmere", "Store locations", "Cashmere care"],
    },
    {
      title: "Terms of service",
      links: [
        "Terms of service",
        "Account & delivery terms",
        "Privacy policy",
        "Returns & exchanges",
      ],
    },
    {
      title: "For shareholders",
      links: [
        "Corporate governance",
        "Board of directors",
        "Executive management",
        "Dividends",
        "News & updates",
      ],
    },
  ],
  faqTitle: "Frequently asked questions",
  faqSubtitle: "About cashmere, delivery and care",
  faqs: [
    {
      q: "Where does your cashmere come from?",
      a: "All of our raw fiber comes from herds raised in Mongolia's Gobi region — select cashmere finer than 16 microns.",
    },
    {
      q: "How long does delivery take?",
      a: "1–2 business days within Ulaanbaatar, 5–10 business days to the countryside and internationally. Free delivery on orders over 500,000₮.",
    },
    {
      q: "How should I care for my cashmere?",
      a: "Hand wash or use a gentle cashmere cycle below 30°C. Dry flat and steam rather than iron.",
    },
    {
      q: "What is your return and exchange policy?",
      a: "Returns and exchanges are accepted within 14 days of delivery for unworn items with all tags attached.",
    },
    {
      q: "How do I choose my size?",
      a: "Every product page has a size chart. If you're between two sizes, we recommend sizing up.",
    },
  ],
  newsletterTitle: "Stay in the loop",
  newsletterSubtitle: "Be the first to hear about new arrivals and sales",
  newsletterText:
    "Sign up with your email to get Tod Cashmere's new arrivals and sale news first.",
  emailPlaceholder: "Email address",
  subscribe: "Subscribe",

  searchTitle: "Search",
  searchResults: '"{query}" — {count} results',
  searchPrompt: "Enter a search term",

  cartCount: "{count} items in your cart",
  cartEmpty: "Your cart is empty.",
  total: "Total",
  shippingInfo: "Delivery details",
  fullName: "Full name",
  phone: "Phone number",
  address: "Address",
  paymentMethod: "Payment method",
  card: "Card",
  processingPayment: "Processing payment...",
  placeOrder: "Place demo order",
  orderSuccess: "Demo payment successful. Your order has been placed.",
  orderConfirmed: "Order confirmed",
  orderNumber: "Order number: {id}",

  bundleEyebrow: "Look 04 · Autumn Atelier",
  bundleTitle: "Quiet Expression",
  bundleIntro:
    "Pick the pieces you love, or take the complete look at the best price.",
  bundleImageAlt: "Model wearing the five-piece Atelier bundle",
  bundleCity: "Ulaanbaatar · 2026",
  bundleEditTitle: "Build your look",
  selectAll: "Select all",
  selected: "selected",
  bundlePricing: "Bundle pricing",
  tierNone: "Individual pricing",
  hintNone: "Select 3 or more pieces to unlock bundle pricing.",
  tierFull: "Complete look · 20% off",
  hintFull: "Save 20% on the complete five-piece look.",
  tierPartial: "Your selection · 12% off",
  hintPartial: "Save 12% when you pick 3 or more pieces.",
  subtotal: "Items subtotal",
  savings: "You save",
  bundleTotal: "Bundle total",
  addBundle: "Add selected bundle to cart",
  bundleAdded: "Bundle added to cart",
  lookItems: [
    {
      title: "Long cashmere-blend coat",
      detail1: "Charcoal · Size M",
      detail2: "Brushed finish · lined",
    },
    {
      title: "Soft cashmere turtleneck",
      detail1: "Warm ivory · Size M",
      detail2: "16 micron · relaxed fit",
    },
    {
      title: "Wide-leg trousers",
      detail1: "Copper brown · Size 38",
      detail2: "Soft tailoring · full length",
    },
    {
      title: "Lightweight cashmere scarf",
      detail1: "Mushroom brown · One size",
      detail2: "Pure cashmere · 180 × 40 cm",
    },
    {
      title: "Leather ankle boots",
      detail1: "Espresso brown · Size 38",
      detail2: "Calfskin · 55 mm heel",
    },
  ],

  footerBlurb: "Premium Mongolian cashmere crafted with care.",
  footerFindStore: "Find a store near you →",
  footerCompany: "Company",
  footerHelp: "Help",
  footerLegal: "Legal",
  footerAbout: "About Tod Cashmere",
  footerCareers: "Careers",
  footerPress: "Press",
  footerStores: "Store Locator",
  footerShipping: "Shipping",
  footerReturns: "Returns",
  footerContact: "Contact",
  footerTerms: "Terms",
  footerPrivacy: "Privacy",
  footerCookies: "Cookies",
};

const ru: Dict = {
  women: "Женщинам",
  men: "Мужчинам",
  sale: "Распродажа",
  newArrivals: "Новинки",
  lookbook: "Лукбук",
  bundle: "Комплект",
  openMenu: "Открыть меню",
  toggleTheme: "Сменить тему",
  selectLanguage: "Выбрать язык",
  search: "Поиск",
  searchPlaceholder: "Поиск по Tod Cashmere...",
  close: "Закрыть",
  cart: "Корзина",
  viewAll: "Смотреть все",

  megaNew: "Новинки",
  megaEssentials: "Базовые вещи",
  megaBestsellers: "Хиты продаж",
  megaTops: "Топы",
  megaSweaters: "Свитеры",
  megaCardigans: "Кардиганы",
  megaHoodies: "Худи",
  megaDresses: "Платья",
  megaAccessories: "Аксессуары",
  megaBeanies: "Шапки",
  megaScarves: "Шарфы и палантины",
  megaGloves: "Перчатки",
  megaShoes: "Обувь",
  megaOuterwear: "Верхняя одежда",
  megaCoats: "Пальто",
  megaBlazers: "Блейзеры",
  megaJackets: "Куртки",
  megaCollection: "Коллекция",
  megaCollectionCaption: "Весна–Лето 2026",
  megaSale: "Распродажа",
  megaSaleWomen: "Женская распродажа",
  megaSaleMen: "Мужская распродажа",

  login: "Войти",
  signUp: "Регистрация",
  profile: "Профиль",
  admin: "Админ-панель",
  signOut: "Выйти",
  account: "Аккаунт",
  signInSubtitle: "Войдите в свой аккаунт",
  signUpSubtitle: "Создайте новый аккаунт",
  name: "Имя",
  email: "Эл. почта",
  password: "Пароль",
  passwordHint: "Не менее 8 символов",
  pleaseWait: "Подождите...",
  noAccount: "Нет аккаунта?",
  haveAccount: "Уже есть аккаунт?",
  authError: "Произошла ошибка. Попробуйте ещё раз.",
  profileSubtitle: "Данные вашего аккаунта",
  role: "Роль",
  roleAdmin: "Администратор",
  roleUser: "Покупатель",
  memberSince: "Дата регистрации",
  openAdmin: "Открыть админ-панель",

  addToCart: "В корзину",
  added: "Добавлено ✓",
  outOfStock: "Нет в наличии",
  shopCategory: "Смотреть: {name} →",
  productCode: "Артикул",
  collection: "Коллекция",
  collectionCatalog: "Каталог",
  collectionArrival: "Новое поступление",
  relatedTitle: "Смотрите также",
  relatedSubtitle: "Похожие товары",
  badges: {
    Эрэгтэй: "Мужское",
    "Гадуур хувцас": "Верхняя одежда",
    "Гол бараа": "Базовое",
    Шинэ: "Новинка",
    Хямдрал: "Скидка",
    Онцлох: "Избранное",
  },

  introEyebrow: "Кашемир монгольской Гоби",
  introTitle1: "Мягкость,",
  introTitle2: "созданная для кожи.",
  introLead:
    "Кашемир ручного вычёсывания тоньше 16 микрон. Роскошь в любой сезон, комфорт каждый день.",
  categoriesTitle: "Категории товаров",
  categoriesSubtitle: "Выберите категорию",
  featuredTitle: "Избранное",
  featuredSubtitle: "Лучший выбор нашей команды",
  catalogHighlights: "Лучшее из каталога",
  saleTitle: "Кашемировая обувь",
  saleSubtitle: "Специальные скидки Tod Cashmere",
  arrivalsTitle: "Новинки",
  arrivalsSubtitle: "Новые силуэты, лимитированные капсулы",
  lookbookTitle: "Лукбук и истории",
  lookbookSubtitle: "Идеи о фактуре, материалах и стиле",
  stories: [
    {
      title: "Уникальный кашемир 16 микрон",
      excerpt:
        "Исключительно тонкое сырьё от животных, закалённых суровым холодным климатом.",
      link: "Подробнее →",
    },
    {
      title: "Эко-красители, природные цвета",
      excerpt:
        "Новая водосберегающая технология окрашивания дольше сохраняет цвет и бережна к коже.",
      link: "Руководство по уходу →",
    },
  ],
  craftTitle: "Мастерство кашемира",
  craftSubtitle: "Коротко о качестве и уходе",
  craftCta: "Смотреть каталог",
  craftText:
    "Tod Cashmere начинался с увлечённости небольшой семейной мастерской, и по сей день каждое изделие, созданное вручную, проходит тщательную проверку.",
  craftItems: [
    {
      label: "Ручная отделка",
      desc: "Каждое изделие дорабатывается вручную, сохраняя мягкость и пластичность материала.",
    },
    {
      label: "Прослеживаемое волокно",
      desc: "Мы подтверждаем, что всё сырьё поступает от пастухов, с которыми мы сотрудничаем.",
    },
    {
      label: "Пожизненный уход",
      desc: "Бесплатное удаление катышков и уход паром во всех магазинах.",
    },
  ],
  infoTitle: "Полезные ссылки",
  infoSubtitle: "Поддержка, правила, информация для инвесторов",
  infoColumns: [
    {
      title: "О нас",
      links: ["О Tod Cashmere", "Адреса магазинов", "Уход за кашемиром"],
    },
    {
      title: "Условия обслуживания",
      links: [
        "Условия обслуживания",
        "Регистрация и доставка",
        "Политика конфиденциальности",
        "Возврат и обмен",
      ],
    },
    {
      title: "Акционерам",
      links: [
        "Корпоративное управление",
        "Совет директоров",
        "Исполнительное руководство",
        "Дивиденды",
        "Новости",
      ],
    },
  ],
  faqTitle: "Частые вопросы",
  faqSubtitle: "О кашемире, доставке и уходе",
  faqs: [
    {
      q: "Откуда ваш кашемир?",
      a: "Всё наше сырьё поступает от стад, выращенных в монгольской Гоби, — это отборный кашемир тоньше 16 микрон.",
    },
    {
      q: "Сколько длится доставка?",
      a: "1–2 рабочих дня по Улан-Батору, 5–10 рабочих дней по регионам и за рубеж. Бесплатная доставка при заказе от 500 000₮.",
    },
    {
      q: "Как ухаживать за кашемиром?",
      a: "Стирайте вручную или в деликатном режиме для кашемира при температуре ниже 30°C. Сушите в расправленном виде и отпаривайте вместо глажки.",
    },
    {
      q: "Каковы условия возврата и обмена?",
      a: "Возврат и обмен возможны в течение 14 дней после получения, если изделие не использовалось и сохранены все ярлыки.",
    },
    {
      q: "Как выбрать размер?",
      a: "На странице каждого товара есть таблица размеров. Если вы между двумя размерами, рекомендуем выбрать больший.",
    },
  ],
  newsletterTitle: "Будьте в курсе",
  newsletterSubtitle: "Узнавайте первыми о новинках и скидках",
  newsletterText:
    "Подпишитесь по email, чтобы первыми узнавать о новинках и скидках Tod Cashmere.",
  emailPlaceholder: "Адрес эл. почты",
  subscribe: "Подписаться",

  searchTitle: "Поиск",
  searchResults: "«{query}» — результатов: {count}",
  searchPrompt: "Введите запрос",

  cartCount: "Товаров в корзине: {count}",
  cartEmpty: "Ваша корзина пуста.",
  total: "Итого",
  shippingInfo: "Данные доставки",
  fullName: "ФИО",
  phone: "Номер телефона",
  address: "Адрес",
  paymentMethod: "Способ оплаты",
  card: "Карта",
  processingPayment: "Проверка оплаты...",
  placeOrder: "Оформить демо-заказ",
  orderSuccess: "Демо-оплата прошла успешно. Заказ оформлен.",
  orderConfirmed: "Заказ подтверждён",
  orderNumber: "Номер заказа: {id}",

  bundleEyebrow: "Образ 04 · Осеннее ателье",
  bundleTitle: "Тихая выразительность",
  bundleIntro:
    "Выберите понравившиеся вещи или возьмите весь образ по самой выгодной цене.",
  bundleImageAlt: "Модель в комплекте Atelier из пяти вещей",
  bundleCity: "Улан-Батор · 2026",
  bundleEditTitle: "Соберите образ",
  selectAll: "Выбрать все",
  selected: "выбрано",
  bundlePricing: "Цена комплекта",
  tierNone: "Цена за каждую вещь",
  hintNone: "Выберите 3 и более вещей, чтобы получить цену комплекта.",
  tierFull: "Полный образ · скидка 20%",
  hintFull: "Сэкономьте 20% на полном образе из 5 вещей.",
  tierPartial: "Ваш выбор · скидка 12%",
  hintPartial: "Сэкономьте 12% при выборе 3 и более вещей.",
  subtotal: "Сумма товаров",
  savings: "Ваша экономия",
  bundleTotal: "Итого за комплект",
  addBundle: "Добавить комплект в корзину",
  bundleAdded: "Комплект добавлен в корзину",
  lookItems: [
    {
      title: "Длинное пальто с кашемиром",
      detail1: "Графитовый · размер M",
      detail2: "Начёсанная поверхность · на подкладке",
    },
    {
      title: "Мягкая кашемировая водолазка",
      detail1: "Тёплая слоновая кость · размер M",
      detail2: "16 микрон · свободный крой",
    },
    {
      title: "Широкие брюки",
      detail1: "Медно-коричневый · размер 38",
      detail2: "Мягкий крой · удлинённая модель",
    },
    {
      title: "Лёгкий кашемировый шарф",
      detail1: "Грибной коричневый · один размер",
      detail2: "Чистый кашемир · 180 × 40 см",
    },
    {
      title: "Кожаные ботильоны",
      detail1: "Эспрессо · размер 38",
      detail2: "Телячья кожа · каблук 55 мм",
    },
  ],

  footerBlurb: "Премиальный монгольский кашемир, созданный с заботой.",
  footerFindStore: "Найти ближайший магазин →",
  footerCompany: "Компания",
  footerHelp: "Помощь",
  footerLegal: "Правовая информация",
  footerAbout: "О Tod Cashmere",
  footerCareers: "Карьера",
  footerPress: "Пресса",
  footerStores: "Магазины",
  footerShipping: "Доставка",
  footerReturns: "Возврат",
  footerContact: "Контакты",
  footerTerms: "Условия",
  footerPrivacy: "Конфиденциальность",
  footerCookies: "Cookies",
};

const zh: Dict = {
  women: "女士",
  men: "男士",
  sale: "特惠",
  newArrivals: "新品",
  lookbook: "Lookbook",
  bundle: "套装",
  openMenu: "打开菜单",
  toggleTheme: "切换深色模式",
  selectLanguage: "选择语言",
  search: "搜索",
  searchPlaceholder: "搜索 Tod Cashmere...",
  close: "关闭",
  cart: "购物车",
  viewAll: "查看全部",

  megaNew: "新品",
  megaEssentials: "经典单品",
  megaBestsellers: "畅销商品",
  megaTops: "上衣",
  megaSweaters: "毛衣",
  megaCardigans: "开衫",
  megaHoodies: "连帽衫",
  megaDresses: "连衣裙",
  megaAccessories: "配饰",
  megaBeanies: "帽子",
  megaScarves: "围巾与披肩",
  megaGloves: "手套",
  megaShoes: "鞋履",
  megaOuterwear: "外套",
  megaCoats: "大衣",
  megaBlazers: "西装外套",
  megaJackets: "夹克",
  megaCollection: "系列",
  megaCollectionCaption: "2026 春夏",
  megaSale: "特惠",
  megaSaleWomen: "女士特惠",
  megaSaleMen: "男士特惠",

  login: "登录",
  signUp: "注册",
  profile: "个人资料",
  admin: "管理后台",
  signOut: "退出登录",
  account: "账户",
  signInSubtitle: "登录您的账户",
  signUpSubtitle: "创建新账户",
  name: "姓名",
  email: "电子邮箱",
  password: "密码",
  passwordHint: "至少 8 个字符",
  pleaseWait: "请稍候...",
  noAccount: "还没有账户？",
  haveAccount: "已有账户？",
  authError: "出错了，请重试。",
  profileSubtitle: "您的账户信息",
  role: "角色",
  roleAdmin: "管理员",
  roleUser: "顾客",
  memberSince: "注册时间",
  openAdmin: "进入管理后台",

  addToCart: "加入购物车",
  added: "已加入 ✓",
  outOfStock: "已售罄",
  shopCategory: "选购{name} →",
  productCode: "商品编号",
  collection: "系列",
  collectionCatalog: "常规系列",
  collectionArrival: "新品",
  relatedTitle: "更多推荐",
  relatedSubtitle: "相似商品",
  badges: {
    Эрэгтэй: "男士",
    "Гадуур хувцас": "外套",
    "Гол бараа": "经典",
    Шинэ: "新品",
    Хямдрал: "特惠",
    Онцлох: "精选",
  },

  introEyebrow: "蒙古戈壁羊绒",
  introTitle1: "为肌肤而生的",
  introTitle2: "极致柔软。",
  introLead: "手工梳理、细于 16 微米的羊绒。四季奢华，日日舒适。",
  categoriesTitle: "产品类别",
  categoriesSubtitle: "按类别浏览",
  featuredTitle: "精选商品",
  featuredSubtitle: "团队精选推荐",
  catalogHighlights: "目录精选",
  saleTitle: "羊绒鞋履",
  saleSubtitle: "Tod Cashmere 精选特惠",
  arrivalsTitle: "新品上市",
  arrivalsSubtitle: "全新廓形，限量胶囊系列",
  lookbookTitle: "Lookbook 与故事",
  lookbookSubtitle: "关于肤感、材质与搭配的灵感",
  stories: [
    {
      title: "独特的 16 微米羊绒",
      excerpt: "源自在严寒气候中生长的畜群，纤维极其细腻。",
      link: "了解更多 →",
    },
    {
      title: "环保染料，自然色彩",
      excerpt: "全新节水染色工艺，色彩更持久，触感更柔和。",
      link: "护理指南 →",
    },
  ],
  craftTitle: "羊绒工艺",
  craftSubtitle: "关于品质与护理",
  craftCta: "浏览目录",
  craftText:
    "Tod Cashmere 始于一家小型家庭作坊的热忱，至今仍对每一件手工制作的单品严格把关。",
  craftItems: [
    { label: "手工收尾", desc: "每件单品均经手工收尾，保留面料柔软垂顺的质感。" },
    { label: "可溯源纤维", desc: "每批原料均确认来自我们合作的牧民。" },
    { label: "终身护理", desc: "所有门店均提供免费去球及蒸汽护理服务。" },
  ],
  infoTitle: "实用链接",
  infoSubtitle: "支持、政策与投资者信息",
  infoColumns: [
    {
      title: "关于我们",
      links: ["关于 Tod Cashmere", "门店位置", "羊绒护理"],
    },
    {
      title: "服务条款",
      links: ["服务条款", "注册与配送条款", "隐私政策", "退换货政策"],
    },
    {
      title: "股东信息",
      links: ["公司治理", "董事会", "管理层", "股息", "新闻动态"],
    },
  ],
  faqTitle: "常见问题",
  faqSubtitle: "关于羊绒、配送与护理",
  faqs: [
    {
      q: "你们的羊绒来自哪里？",
      a: "我们所有原料均来自蒙古戈壁地区饲养的畜群，是细于 16 微米的精选羊绒。",
    },
    {
      q: "配送需要多长时间？",
      a: "乌兰巴托市内 1–2 个工作日，其他地区及国际配送 5–10 个工作日。订单满 500,000₮ 免运费。",
    },
    {
      q: "如何护理羊绒衣物？",
      a: "手洗或使用羊绒轻柔模式，水温低于 30°C。平铺晾干，用蒸汽熨烫而非熨斗。",
    },
    {
      q: "退换货政策是什么？",
      a: "收货后 14 天内，商品未穿着且吊牌完整，即可退换。",
    },
    {
      q: "如何选择尺码？",
      a: "每个商品页面都有尺码表。如介于两个尺码之间，建议选择大一码。",
    },
  ],
  newsletterTitle: "订阅资讯",
  newsletterSubtitle: "第一时间获取新品与优惠信息",
  newsletterText: "留下您的邮箱，第一时间获取 Tod Cashmere 新品与优惠资讯。",
  emailPlaceholder: "电子邮箱",
  subscribe: "订阅",

  searchTitle: "搜索",
  searchResults: "“{query}” — {count} 个结果",
  searchPrompt: "请输入搜索词",

  cartCount: "购物车中有 {count} 件商品",
  cartEmpty: "您的购物车是空的。",
  total: "合计",
  shippingInfo: "配送信息",
  fullName: "姓名",
  phone: "电话号码",
  address: "地址",
  paymentMethod: "支付方式",
  card: "银行卡",
  processingPayment: "正在处理付款...",
  placeOrder: "提交演示订单",
  orderSuccess: "演示支付成功，订单已提交。",
  orderConfirmed: "订单已确认",
  orderNumber: "订单号：{id}",

  bundleEyebrow: "造型 04 · 秋季工坊",
  bundleTitle: "静谧表达",
  bundleIntro: "挑选心仪单品，或以最优价格入手整套造型。",
  bundleImageAlt: "身穿五件套 Atelier 套装的模特",
  bundleCity: "乌兰巴托 · 2026",
  bundleEditTitle: "打造你的造型",
  selectAll: "全选",
  selected: "已选",
  bundlePricing: "套装价格",
  tierNone: "单品价格",
  hintNone: "选择 3 件及以上即可享受套装价。",
  tierFull: "整套造型 · 8 折",
  hintFull: "购买五件套整套造型立省 20%。",
  tierPartial: "自选组合 · 88 折",
  hintPartial: "选择 3 件及以上立省 12%。",
  subtotal: "商品小计",
  savings: "您节省",
  bundleTotal: "套装总价",
  addBundle: "将所选套装加入购物车",
  bundleAdded: "套装已加入购物车",
  lookItems: [
    {
      title: "羊绒混纺长款大衣",
      detail1: "炭灰色 · M 码",
      detail2: "拉绒表面 · 带内衬",
    },
    {
      title: "柔软羊绒高领衫",
      detail1: "暖象牙白 · M 码",
      detail2: "16 微米 · 宽松版型",
    },
    {
      title: "阔腿裤",
      detail1: "铜棕色 · 38 码",
      detail2: "柔和剪裁 · 长款",
    },
    {
      title: "轻盈羊绒围巾",
      detail1: "蘑菇棕 · 均码",
      detail2: "纯羊绒 · 180 × 40 厘米",
    },
    {
      title: "皮革短靴",
      detail1: "浓缩咖啡棕 · 38 码",
      detail2: "小牛皮 · 55 毫米鞋跟",
    },
  ],

  footerBlurb: "用心打造的高品质蒙古羊绒。",
  footerFindStore: "查找附近门店 →",
  footerCompany: "公司",
  footerHelp: "帮助",
  footerLegal: "法律信息",
  footerAbout: "关于 Tod Cashmere",
  footerCareers: "招聘",
  footerPress: "媒体",
  footerStores: "门店查询",
  footerShipping: "配送",
  footerReturns: "退货",
  footerContact: "联系我们",
  footerTerms: "条款",
  footerPrivacy: "隐私",
  footerCookies: "Cookies",
};

export const dictionary: Record<Lang, Dict> = { mn, en, ru, zh };

// ---- Catalog content: pick the field for the active language, falling back
// to English (or the Mongolian original) when a translation is missing.

type LocalizedProduct = {
  titleMn: string;
  titleEn: string;
  titleRu: string | null;
  titleZh: string | null;
  color: string;
  colorEn: string | null;
  colorRu: string | null;
  colorZh: string | null;
};

type LocalizedCategory = {
  nameMn: string;
  nameEn: string;
  nameRu: string | null;
  nameZh: string | null;
  meta: string;
  metaMn: string | null;
  metaRu: string | null;
  metaZh: string | null;
};

export function productTitle(p: LocalizedProduct, lang: Lang) {
  if (lang === "mn") return p.titleMn;
  if (lang === "ru") return p.titleRu || p.titleEn;
  if (lang === "zh") return p.titleZh || p.titleEn;
  return p.titleEn;
}

export function productColor(p: LocalizedProduct, lang: Lang) {
  if (lang === "mn") return p.color;
  if (lang === "ru") return p.colorRu || p.colorEn || p.color;
  if (lang === "zh") return p.colorZh || p.colorEn || p.color;
  return p.colorEn || p.color;
}

export function categoryName(c: LocalizedCategory, lang: Lang) {
  if (lang === "mn") return c.nameMn;
  if (lang === "ru") return c.nameRu || c.nameEn;
  if (lang === "zh") return c.nameZh || c.nameEn;
  return c.nameEn;
}

export function categoryMeta(c: LocalizedCategory, lang: Lang) {
  if (lang === "mn") return c.metaMn || c.meta;
  if (lang === "ru") return c.metaRu || c.meta;
  if (lang === "zh") return c.metaZh || c.meta;
  return c.meta;
}

/** Badges are stored as Mongolian labels; unknown ones are shown as typed. */
export function badgeLabel(badge: string, dict: Dict) {
  return dict.badges[badge] ?? badge;
}
