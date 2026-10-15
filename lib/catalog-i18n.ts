import type { Lang } from "./i18n";
import { findCashmereColor, splitColors } from "./catalog-colors";

// Text for the /catalog page in each site language. Item names come from the
// admin as typed and are not translated.
const strings = {
  mn: {
    similar: "Төстэй бараа",
    admin: "Админ",
    back: "Каталог руу буцах",
    color: "Өнгө",
    size: "Хэмжээ",
    women: "Эмэгтэй",
    men: "Эрэгтэй",
    all: "Бүгд",
    eyebrow: "Онлайн каталог",
    title1: "Монгол говийн",
    title2: "ноолуур.",
    lead: "Монголын хээр тал, нүүдэлчдийн соёлоос таны гарт.",
    styles: "загвар",
    search: "Хайх",
    searchPlaceholder: "Каталогоос хайх…",
    searchResults: "Хайлт",
    close: "Хаах",
    saved: "Хадгалсан",
    savedEmpty: "Зүрхэн дээр дарж таалагдсан бараагаа энд хадгална уу.",
    save: "Хадгалах",
    unsave: "Хадгалснаас хасах",
    openMenu: "Цэс нээх",
    language: "Хэл сонгох",
    introHint: "Дарж үргэлжлүүлнэ үү →",
    nextPage: "Дараагийн хуудас",
  },
  en: {
    similar: "You may also like",
    admin: "Admin",
    back: "Back to catalog",
    color: "Color",
    size: "Size",
    women: "Women",
    men: "Men",
    all: "All",
    eyebrow: "Online catalog",
    title1: "Mongolian Gobi",
    title2: "cashmere.",
    lead: "From the Mongolian steppe and nomadic culture to your hands.",
    styles: "styles",
    search: "Search",
    searchPlaceholder: "Search the catalog…",
    searchResults: "Search",
    close: "Close",
    saved: "Saved",
    savedEmpty: "Tap the heart on any piece to save it here.",
    save: "Save",
    unsave: "Remove from saved",
    openMenu: "Open menu",
    language: "Select language",
    introHint: "Tap to continue →",
    nextPage: "Next page",
  },
  ru: {
    similar: "Похожие модели",
    admin: "Админ",
    back: "Назад к каталогу",
    color: "Цвет",
    size: "Размер",
    women: "Женщинам",
    men: "Мужчинам",
    all: "Все",
    eyebrow: "Онлайн-каталог",
    title1: "Монгольский",
    title2: "кашемир Гоби.",
    lead: "Из монгольских степей и кочевой культуры — в ваши руки.",
    styles: "моделей",
    search: "Поиск",
    searchPlaceholder: "Поиск по каталогу…",
    searchResults: "Поиск",
    close: "Закрыть",
    saved: "Избранное",
    savedEmpty: "Нажмите на сердечко, чтобы сохранить вещь здесь.",
    save: "В избранное",
    unsave: "Убрать из избранного",
    openMenu: "Открыть меню",
    language: "Выбрать язык",
    introHint: "Нажмите, чтобы продолжить →",
    nextPage: "Следующая страница",
  },
  zh: {
    similar: "相似款式",
    admin: "管理",
    back: "返回目录",
    color: "颜色",
    size: "尺码",
    women: "女士",
    men: "男士",
    all: "全部",
    eyebrow: "在线目录",
    title1: "蒙古戈壁",
    title2: "羊绒。",
    lead: "源自蒙古草原与游牧文化，送到您手中。",
    styles: "款",
    search: "搜索",
    searchPlaceholder: "搜索目录…",
    searchResults: "搜索",
    close: "关闭",
    saved: "收藏",
    savedEmpty: "点击爱心即可将喜欢的单品收藏在这里。",
    save: "收藏",
    unsave: "取消收藏",
    openMenu: "打开菜单",
    language: "选择语言",
    introHint: "点击继续 →",
    nextPage: "下一页",
  },
} satisfies Record<Lang, Record<string, string>>;

export type CatalogStrings = (typeof strings)["mn"];

export const catalogStrings = (lang: Lang): CatalogStrings => strings[lang];

// Garment type names (stored in Mongolian) in the other languages.
const typeNames: Record<string, [en: string, ru: string, zh: string]> = {
  "Оймс": ["Socks", "Носки", "袜子"],
  "Түрий": ["Leg warmers", "Гетры", "护腿"],
  "Өвдөгөвч": ["Knee warmers", "Наколенники", "护膝"],
  "Улавч": ["Insoles", "Стельки", "鞋垫"],
  "Бойтог": ["Booties", "Сапожки", "短靴"],
  "Малгай": ["Hats", "Шапки", "帽子"],
  "Ороолт": ["Scarves", "Шарфы", "围巾"],
  "Хүзүүвч": ["Neck warmers", "Снуды", "围脖"],
  "Бээлий": ["Gloves", "Перчатки", "手套"],
  "Цамц": ["Knit shirts", "Кофты", "针织衫"],
  "Ханцуйгүй цамц, хүрэм": ["Vests & jackets", "Жилеты и куртки", "背心与外套"],
  "Нуруувч": ["Back warmers", "Пояса для спины", "护腰"],
  "Даашинз": ["Dresses", "Платья", "连衣裙"],
  "Өмд": ["Trousers", "Брюки", "裤子"],
  "Богино өмд": ["Shorts", "Шорты", "短裤"],
  "Банзал (юбка)": ["Skirts", "Юбки", "半身裙"],
  "Джемпер": ["Jumpers", "Джемперы", "套头衫"],
  "Свитер": ["Sweaters", "Свитеры", "毛衣"],
  "Пуловер": ["Pullovers", "Пуловеры", "套衫"],
  "Кардиган": ["Cardigans", "Кардиганы", "开衫"],
  "Майк": ["Knit tops", "Топы", "针织上衣"],
  "Жилет": ["Vests", "Жилеты", "马甲"],
  "Платье": ["Dresses", "Платья", "连衣裙"],
  "Шорт": ["Shorts", "Шорты", "短裤"],
  "Юбка": ["Skirts", "Юбки", "半身裙"],
  "Бомбер": ["Bombers", "Бомберы", "飞行员夹克"],
  "Поло": ["Polos", "Поло", "Polo衫"],
};

export function catalogTypeName(type: string, lang: Lang) {
  if (lang === "mn") return type;
  const names = typeNames[type];
  return names ? pick(names, lang) : type;
}

// Item names (as typed in the admin, in Mongolian) in the other languages.
// Names not listed here show as typed.
const itemNames: Record<string, [en: string, ru: string, zh: string]> = {
  "Алаг кардиган": ["Two-tone cardigan", "Двухцветный кардиган", "撞色开衫"],
  "Алаг майк": ["Two-tone knit top", "Двухцветный топ", "撞色针织上衣"],
  "Алаг платье": ["Two-tone dress", "Двухцветное платье", "撞色连衣裙"],
  "Битүү кебельтэй свитер": ["All-over cable sweater", "Свитер с косами", "全麻花毛衣"],
  "Битүү кебельтэй цамц": ["All-over cable knit shirt", "Кофта с косами", "全麻花针织衫"],
  "Богино дотуур өмд": ["Short leggings", "Короткие леггинсы", "短款打底裤"],
  "Богино ханцуйтай платье": ["Short-sleeve dress", "Платье с коротким рукавом", "短袖连衣裙"],
  "Богино ханцуйтай сорочка": ["Short-sleeve collared top", "Кофта с воротником и коротким рукавом", "短袖翻领衫"],
  "Бомбер": ["Bomber", "Бомбер", "飞行员夹克"],
  "Бүтэн кебельтэй цамц": ["Full cable knit shirt", "Кофта с косами", "全麻花针织衫"],
  "Гурвалжин захтай джемпер": ["V-neck jumper", "Джемпер с V-вырезом", "V领套头衫"],
  "Джемпер": ["Jumper", "Джемпер", "套头衫"],
  "Дотуур өмд": ["Leggings", "Леггинсы", "打底裤"],
  "Жилет": ["Vest", "Жилет", "马甲"],
  "Канттай өмд": ["Side-stripe trousers", "Брюки с лампасами", "侧条纹裤"],
  "Кардиган": ["Cardigan", "Кардиган", "开衫"],
  "Кебель урт кардиган": ["Long cable cardigan", "Длинный кардиган с косами", "长款麻花开衫"],
  "Кебель өргөн өмд": ["Wide cable trousers", "Широкие брюки с косами", "麻花阔腿裤"],
  "Кебельтэй цахилгаантай кардиган": ["Cable zip cardigan", "Кардиган на молнии с косами", "麻花拉链开衫"],
  "Майк": ["Knit top", "Топ", "针织上衣"],
  "Малгайтай цамц": ["Hoodie", "Худи", "连帽衫"],
  "Нарийн джемпер": ["Slim jumper", "Приталенный джемпер", "修身套头衫"],
  "Нимгэн кардиган": ["Fine-knit cardigan", "Тонкий кардиган", "薄款开衫"],
  "Оноотой өмд": ["Slit trousers", "Брюки с разрезами", "开衩裤"],
  "Платье": ["Dress", "Платье", "连衣裙"],
  "Пуловер": ["Pullover", "Пуловер", "套衫"],
  "Свитер": ["Sweater", "Свитер", "毛衣"],
  "Сорочка цамц": ["Collared knit shirt", "Кофта с воротником", "翻领针织衫"],
  "Сорочкан захтай майк": ["Collared knit top", "Топ с воротником", "翻领针织上衣"],
  "Сорочкин захтай цамц": ["Shirt-collar knit shirt", "Кофта с рубашечным воротником", "衬衫领针织衫"],
  "Сүлжмэл захтай майк": ["Knit-collar top", "Топ с вязаным воротником", "针织领上衣"],
  "Товчтой кардиган": ["Button cardigan", "Кардиган на пуговицах", "纽扣开衫"],
  "Товчтой майк": ["Button knit top", "Топ на пуговицах", "纽扣针织上衣"],
  "Урт майк": ["Long knit top", "Удлинённый топ", "长款针织上衣"],
  "Уяатай свитер": ["Tie sweater", "Свитер с завязками", "系带毛衣"],
  "Уяатай цамц": ["Tie knit shirt", "Кофта с завязками", "系带针织衫"],
  "Хагас ханцуйтай джемпер": ["Half-sleeve jumper", "Джемпер с рукавом до локтя", "中袖套头衫"],
  "Хагас ханцуйтай майк": ["Half-sleeve knit top", "Топ с рукавом до локтя", "中袖针织上衣"],
  "Хагас ханцуйтай платье": ["Half-sleeve dress", "Платье с рукавом до локтя", "中袖连衣裙"],
  "Хошуу захтай кардиган": ["Pointed-collar cardigan", "Кардиган с острым воротником", "尖领开衫"],
  "Цамц": ["Knit shirt", "Кофта", "针织衫"],
  "Цахилгаантай кардиган": ["Zip cardigan", "Кардиган на молнии", "拉链开衫"],
  "Цахилгаантай кебельтэй кардиган": ["Cable zip cardigan", "Кардиган на молнии с косами", "麻花拉链开衫"],
  "Цахилгаантай майк": ["Zip knit top", "Топ на молнии", "拉链针织上衣"],
  "Цахилгаантай поло": ["Zip polo", "Поло на молнии", "拉链Polo衫"],
  "Шорт": ["Shorts", "Шорты", "短裤"],
  "Шулуун юбка": ["Straight skirt", "Прямая юбка", "直筒半身裙"],
  "Эм майк": ["Women's knit top", "Женский топ", "女款针织上衣"],
  "Юбка": ["Skirt", "Юбка", "半身裙"],
  "Өмд": ["Trousers", "Брюки", "裤子"],
  "Өргөн карматай өмд": ["Wide patch-pocket trousers", "Широкие брюки с накладными карманами", "贴袋阔腿裤"],
  "Өргөн уяатай өмд": ["Wide drawstring trousers", "Широкие брюки на завязках", "抽绳阔腿裤"],
  "Өргөн ханцуйтай джемпер": ["Wide-sleeve jumper", "Джемпер с широкими рукавами", "宽袖套头衫"],
  "Өргөн өмд халаастай": ["Wide trousers with pockets", "Широкие брюки с карманами", "带口袋阔腿裤"],
};

const pick = (names: [string, string, string], lang: Exclude<Lang, "mn">) =>
  names[lang === "en" ? 0 : lang === "ru" ? 1 : 2];

export function catalogItemName(name: string, lang: Lang) {
  const names = itemNames[name.trim()];
  return lang === "mn" || !names ? name : pick(names, lang);
}

// Material and colors are typed in English in the admin, as in the printed
// catalog; these cover the values it uses.
const materials: Record<string, Record<Lang, string>> = {
  "100% mongolian cashmere": {
    mn: "100% Монгол ноолуур",
    en: "100% Mongolian cashmere",
    ru: "100% монгольский кашемир",
    zh: "100% 蒙古羊绒",
  },
};


export function catalogMaterial(material: string, lang: Lang) {
  return materials[material.trim().toLowerCase()]?.[lang] ?? material;
}

export function catalogColors(list: string, lang: Lang) {
  return splitColors(list)
    .map((c) => findCashmereColor(c)?.names[lang] ?? c)
    .join(", ");
}
