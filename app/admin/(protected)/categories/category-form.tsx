import Link from "next/link";
import type { categories } from "@/lib/db/schema";
import { btnDark, btnSoft, input, label, panel } from "../../ui";

type Category = typeof categories.$inferSelect;

function Field({
  name,
  title,
  defaultValue,
  required,
  type = "text",
  placeholder,
}: {
  name: string;
  title: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={label} htmlFor={name}>
        {title}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className={input}
      />
    </div>
  );
}

export function CategoryForm({
  action,
  category,
}: {
  action: (formData: FormData) => void;
  category?: Category;
}) {
  return (
    <form action={action} className="grid max-w-5xl gap-6 lg:grid-cols-2">
      <section className={`${panel} space-y-4 p-7`}>
        <h2 className="text-base font-medium">Нэр (4 хэл)</h2>
        <Field name="nameMn" title="Монгол" defaultValue={category?.nameMn} required />
        <Field name="nameEn" title="English" defaultValue={category?.nameEn} />
        <Field name="nameRu" title="Русский (заавал биш)" defaultValue={category?.nameRu} />
        <Field name="nameZh" title="中文 (заавал биш)" defaultValue={category?.nameZh} />
      </section>
      <section className={`${panel} space-y-4 p-7`}>
        <h2 className="text-base font-medium">Тайлбар мөр (4 хэл)</h2>
        <Field name="metaMn" title="Монгол" defaultValue={category?.metaMn} placeholder="Пальто · Куртка" />
        <Field name="meta" title="English" defaultValue={category?.meta} placeholder="Coats · Jackets" />
        <Field name="metaRu" title="Русский" defaultValue={category?.metaRu} />
        <Field name="metaZh" title="中文" defaultValue={category?.metaZh} />
      </section>
      <section className={`${panel} space-y-4 p-7`}>
        <h2 className="text-base font-medium">Үндсэн</h2>
        <Field name="slug" title="Slug (URL)" defaultValue={category?.slug} required />
        <Field name="sortOrder" title="Дараалал" type="number" defaultValue={category?.sortOrder ?? 0} />
      </section>
      <section className={`${panel} space-y-4 p-7`}>
        <h2 className="text-base font-medium">Зураг</h2>
        <Field name="imagePath" title="Зургийн зам" defaultValue={category?.image} placeholder="/images/example.jpg" />
        <div>
          <label className={label} htmlFor="imageFile">
            Эсвэл шинэ зураг оруулах
          </label>
          <input id="imageFile" type="file" name="imageFile" accept="image/*" className="w-full text-sm" />
        </div>
      </section>
      <div className="flex gap-3 lg:col-span-2">
        <button type="submit" className={btnDark}>
          Хадгалах
        </button>
        <Link href="/admin/categories" className={btnSoft}>
          Болих
        </Link>
      </div>
    </form>
  );
}
