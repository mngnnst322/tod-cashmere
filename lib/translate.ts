import { getCloudflareContext } from "@opennextjs/cloudflare";

export type Translations = { en: string; ru: string; zh: string };

const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

// Shop vocabulary the model gets wrong on its own.
const GLOSSARY = `Mongolian = English | Russian | Chinese
ноолуур, ноолууран = cashmere | кашемир, кашемировый | 羊绒
хээтэй = patterned | узорчатый | 提花
сүлжмэл = knitted | вязаный | 针织
доторлосон = lined | на подкладке | 内衬
тэмээн бор = camel | кэмел | 驼色
цайвар = light | светлый | 浅
бараан = dark | тёмный | 深
саарал = grey | серый | 灰色
шаргал = beige | бежевый | 米色
цамц = sweater | свитер | 毛衣
ороолт = scarf | шарф | 围巾
малгай = hat | шапка | 帽子
бээлий = gloves | перчатки | 手套
гутал = boots | сапоги | 靴子
бойтог = booties | пинетки | 婴儿鞋
пальто = coat | пальто | 大衣
куртка = jacket | куртка | 夹克
даашинз, платье = dress | платье | 连衣裙
өмд = trousers | брюки | 裤子
юбка = skirt | юбка | 半身裙
том = large | большой | 大号
урт = long | длинный | 长款
богино = short | короткий | 短款
эрэгтэй = men's | мужской | 男士
эмэгтэй = women's | женский | 女士
хүүхдийн = kids' | детский | 儿童`;

/**
 * Translates a short Mongolian label (a product name or colour) into English,
 * Russian and Chinese with Workers AI. On any failure the result is empty and
 * the storefront falls back to English / Mongolian.
 */
export async function translateFromMongolian(text: string): Promise<Translations> {
  const empty = { en: "", ru: "", zh: "" };
  const source = text.trim();
  if (!source) return empty;
  try {
    const { env } = await getCloudflareContext({ async: true });
    const out = (await env.AI.run(MODEL, {
      messages: [
        {
          role: "system",
          content: `You translate short Mongolian product names and colour names for a cashmere clothing shop into English, Russian and Simplified Chinese. Translate every word; never leave Mongolian words or transliterations. Use this glossary:\n${GLOSSARY}\nKeep each translation as short as the original, like a product label. Reply with only JSON: {"en":"…","ru":"…","zh":"…"}`,
        },
        { role: "user", content: source },
      ],
      max_tokens: 120,
    })) as { response?: unknown };
    const parsed =
      typeof out.response === "string" ? JSON.parse(out.response) : (out.response as Partial<Translations>);
    return {
      en: String(parsed?.en ?? "").trim(),
      ru: String(parsed?.ru ?? "").trim(),
      zh: String(parsed?.zh ?? "").trim(),
    };
  } catch {
    return empty;
  }
}
