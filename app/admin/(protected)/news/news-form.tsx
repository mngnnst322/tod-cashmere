import Link from "next/link";
import type { news } from "@/lib/db/schema";
import { btnDark, btnSoft, input, label, panel } from "../../ui";

type News = typeof news.$inferSelect;

const LANGS = [
  { suffix: "Mn", title: "Монгол", required: true },
  { suffix: "En", title: "English", required: false },
  { suffix: "Ru", title: "Русский", required: false },
  { suffix: "Zh", title: "中文", required: false },
] as const;

export function NewsForm({
  action,
  item,
}: {
  action: (formData: FormData) => void;
  item?: News;
}) {
  return (
    <form action={action} className="grid max-w-5xl gap-6 lg:grid-cols-2">
      {LANGS.map((lang) => (
        <section key={lang.suffix} className={`${panel} space-y-4 p-7`}>
          <h2 className="text-base font-medium">
            {lang.title}
            {!lang.required && <span className="ml-2 text-xs text-adm-mute">(заавал биш)</span>}
          </h2>
          <div>
            <label className={label} htmlFor={`title${lang.suffix}`}>
              Гарчиг
            </label>
            <input
              id={`title${lang.suffix}`}
              name={`title${lang.suffix}`}
              defaultValue={item?.[`title${lang.suffix}`] ?? ""}
              required={lang.required}
              className={input}
            />
          </div>
          <div>
            <label className={label} htmlFor={`body${lang.suffix}`}>
              Агуулга
            </label>
            <textarea
              id={`body${lang.suffix}`}
              name={`body${lang.suffix}`}
              defaultValue={item?.[`body${lang.suffix}`] ?? ""}
              required={lang.required}
              rows={6}
              className={input}
            />
          </div>
        </section>
      ))}
      <section className={`${panel} space-y-4 p-7 lg:col-span-2`}>
        <h2 className="text-base font-medium">Зураг</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={label} htmlFor="imagePath">
              Зургийн зам
            </label>
            <input id="imagePath" name="imagePath" defaultValue={item?.image ?? ""} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="imageFile">
              Эсвэл шинэ зураг оруулах
            </label>
            <input id="imageFile" type="file" name="imageFile" accept="image/*" className="w-full pt-2 text-sm" />
          </div>
        </div>
      </section>
      <div className="flex gap-3 lg:col-span-2">
        <button type="submit" className={btnDark}>
          Хадгалах
        </button>
        <Link href="/admin/news" className={btnSoft}>
          Болих
        </Link>
      </div>
    </form>
  );
}
