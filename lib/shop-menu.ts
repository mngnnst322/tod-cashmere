import type { Lang } from "./i18n";

// The shop's top menu ("Нэр төрөл"): each entry is a top-level item, with
// dropdown columns where it has them.

type Link = { label: string; href: string };
type Column = { title: string; links: Link[] };
export type MenuEntry = { key: string; label: string; href: string; columns?: Column[] };

const L = (mn: string, en: string, ru: string, zh: string) => ({ mn, en, ru, zh });
type Text = ReturnType<typeof L>;

const PRICE_RANGES: [number, number][] = [
  [0, 100000],
  [100000, 300000],
  [300000, 500000],
  [500000, 1000000],
];
const priceLabel = (min: number, max: number) =>
  `${min.toLocaleString("en-US")}-${max.toLocaleString("en-US")}₮`;

const T = {
  category: L("Категори", "Category", "Категории", "类别"),
  collection: L("Коллекци", "Collection", "Коллекция", "系列"),
  gifts: L("Бэлгийн сонголт", "Gift ideas", "Подарки", "礼物推荐"),
  springSummer: L("Хавар/Зун", "Spring/Summer", "Весна/Лето", "春夏"),
  autumnWinter: L("Намар/Өвөл", "Autumn/Winter", "Осень/Зима", "秋冬"),
  giftCard: L("Бэлгийн карт", "Gift card", "Подарочная карта", "礼品卡"),
  giftBox: L("Бэлгийн хайрцаг", "Gift box", "Подарочная коробка", "礼盒"),
  tops: L("Цамц", "Tops", "Кофты", "上衣"),
  trousers: L("Өмд", "Trousers", "Брюки", "裤子"),
};

function genderColumns(lang: Lang, gender: "women" | "men"): Column[] {
  const all =
    gender === "women"
      ? L("Бүх эмэгтэй загварууд", "All women's styles", "Все женские модели", "全部女装")
      : L("Бүх эрэгтэй загварууд", "All men's styles", "Все мужские модели", "全部男装");
  const href = `/categories#${gender}`;
  const cats: Text[] = [
    all,
    ...(gender === "women"
      ? [L("Эмэгтэй платье, юбка", "Dresses & skirts", "Платья и юбки", "连衣裙与半身裙")]
      : []),
    T.tops,
    T.trousers,
    T.giftCard,
    T.giftBox,
  ];
  return [
    { title: T.category[lang], links: cats.map((c) => ({ label: c[lang], href })) },
    {
      title: T.collection[lang],
      links: [T.springSummer, T.autumnWinter].map((c) => ({ label: c[lang], href: "/arrivals" })),
    },
    {
      title: T.gifts[lang],
      links: PRICE_RANGES.map(([min, max]) => ({
        label: priceLabel(min, max),
        href: `/search?min=${min}&max=${max}`,
      })),
    },
  ];
}

export function shopMenu(lang: Lang): MenuEntry[] {
  const accessories: Text[] = [
    L("Бүх аксессуар", "All accessories", "Все аксессуары", "全部配饰"),
    L("Малгай", "Hats", "Шапки", "帽子"),
    L("Ороолт", "Scarves", "Шарфы", "围巾"),
    L("Бээлий", "Gloves", "Перчатки", "手套"),
    L("Шааль", "Shawls", "Шали", "披肩"),
  ];
  return [
    { key: "women", label: L("Эмэгтэй", "Women", "Женщинам", "女士")[lang], href: "/categories#women", columns: genderColumns(lang, "women") },
    { key: "men", label: L("Эрэгтэй", "Men", "Мужчинам", "男士")[lang], href: "/categories#men", columns: genderColumns(lang, "men") },
    {
      key: "kids",
      label: L("Хүүхэд", "Kids", "Детям", "儿童")[lang],
      href: "/categories",
      columns: [
        {
          title: T.category[lang],
          links: [
            T.trousers,
            T.tops,
            L("Бойтог", "Booties", "Пинетки", "婴儿鞋"),
            L("Малгай", "Hats", "Шапки", "帽子"),
            L("Ороолт", "Scarves", "Шарфы", "围巾"),
            L("Бээлий", "Gloves", "Перчатки", "手套"),
          ].map((c) => ({ label: c[lang], href: "/categories" })),
        },
      ],
    },
    {
      key: "accessories",
      label: L("Аксессуар", "Accessories", "Аксессуары", "配饰")[lang],
      href: "/categories",
      columns: [{ title: T.category[lang], links: accessories.map((a) => ({ label: a[lang], href: "/categories" })) }],
    },
    { key: "home", label: L("Гэр ахуй", "Home", "Для дома", "家居")[lang], href: "/categories" },
  ];
}
