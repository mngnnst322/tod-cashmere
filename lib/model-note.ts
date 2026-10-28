import type { Lang } from "./i18n";

/**
 * "Модель 175 см өндөртэй, S хэмжээ өмссөн" in the visitor's language, from
 * the model height (cm) and size entered in the admin. Null when unset.
 */
export function modelNote(
  item: { modelHeight: number | null; modelSize: string | null },
  lang: Lang,
): string | null {
  const h = item.modelHeight;
  const size = item.modelSize?.trim();
  if (!h && !size) return null;
  switch (lang) {
    case "en":
      return h && size
        ? `The model is ${h} cm tall and wears size ${size}.`
        : h
          ? `The model is ${h} cm tall.`
          : `The model wears size ${size}.`;
    case "ru":
      return h && size
        ? `Рост модели ${h} см, на ней размер ${size}.`
        : h
          ? `Рост модели ${h} см.`
          : `На модели размер ${size}.`;
    case "zh":
      return h && size ? `模特身高 ${h} 厘米，穿 ${size} 码。` : h ? `模特身高 ${h} 厘米。` : `模特穿 ${size} 码。`;
    default:
      return h && size
        ? `Модель ${h} см өндөртэй, ${size} хэмжээ өмссөн.`
        : h
          ? `Модель ${h} см өндөртэй.`
          : `Модель ${size} хэмжээ өмссөн.`;
  }
}
