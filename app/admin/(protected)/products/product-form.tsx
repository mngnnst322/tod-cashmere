import Link from "next/link";
import type { categories, products } from "@/lib/db/schema";
import { btnDark, btnSoft, input, label, panel } from "../../ui";

type Category = typeof categories.$inferSelect;
type Product = typeof products.$inferSelect;

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`${panel} p-7`}>
      <h2 className="mb-5 text-base font-medium">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  product?: Product;
}) {
  return (
    <form action={action} className="grid max-w-5xl gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Section title="Нэр (4 хэл)">
          <Field name="titleMn" title="Монгол" defaultValue={product?.titleMn} required />
          <Field name="titleEn" title="English" defaultValue={product?.titleEn} />
          <Field name="titleRu" title="Русский (заавал биш)" defaultValue={product?.titleRu} />
          <Field name="titleZh" title="中文 (заавал биш)" defaultValue={product?.titleZh} />
        </Section>
        <Section title="Өнгө (4 хэл)">
          <Field name="color" title="Монгол" defaultValue={product?.color} required />
          <div className="grid grid-cols-3 gap-3">
            <Field name="colorEn" title="EN" defaultValue={product?.colorEn} />
            <Field name="colorRu" title="RU" defaultValue={product?.colorRu} />
            <Field name="colorZh" title="ZH" defaultValue={product?.colorZh} />
          </div>
        </Section>
      </div>

      <div className="space-y-6">
        <Section title="Үндсэн мэдээлэл">
          <Field name="slug" title="Slug (URL)" defaultValue={product?.slug} required placeholder="cashmere-coat-1" />
          <div>
            <label className={label} htmlFor="categorySlug">
              Ангилал
            </label>
            <select id="categorySlug" name="categorySlug" defaultValue={product?.categorySlug} className={input}>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.nameMn}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="collection">
                Төрөл
              </label>
              <select
                id="collection"
                name="collection"
                defaultValue={product?.collection ?? "catalog"}
                className={input}
              >
                <option value="catalog">Каталог</option>
                <option value="arrival">Шинэ</option>
              </select>
            </div>
            <Field name="badge" title="Шошго (заавал биш)" defaultValue={product?.badge} placeholder="Шинэ, Хямдрал..." />
          </div>
        </Section>

        <Section title="Үнэ ба нөөц">
          <div className="grid grid-cols-2 gap-3">
            <Field name="price" title="Үнэ (₮)" type="number" defaultValue={product?.price} required />
            <Field name="compareAtPrice" title="Хуучин үнэ (₮)" type="number" defaultValue={product?.compareAtPrice} />
          </div>
          <Field
            name="stock"
            title="Нөөц (ширхэг, хоосон бол хянахгүй)"
            type="number"
            defaultValue={product?.stock}
          />
          <div className="flex flex-wrap gap-6 pt-1 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="inStock"
                defaultChecked={product?.inStock ?? true}
                className="h-4 w-4 accent-adm-ink"
              />
              Худалдаанд байгаа
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hidden"
                defaultChecked={product?.hidden ?? false}
                className="h-4 w-4 accent-adm-ink"
              />
              Сайтаас нуух
            </label>
          </div>
        </Section>

        <Section title="Зураг">
          <Field name="imagePath" title="Зургийн зам" defaultValue={product?.image} placeholder="/images/example.jpg" />
          <div>
            <label className={label} htmlFor="imageFile">
              Эсвэл шинэ зураг оруулах
            </label>
            <input id="imageFile" type="file" name="imageFile" accept="image/*" className="w-full text-sm" />
          </div>
        </Section>
      </div>

      <div className="flex gap-3 lg:col-span-2">
        <button type="submit" className={btnDark}>
          Хадгалах
        </button>
        <Link href="/admin/products" className={btnSoft}>
          Болих
        </Link>
      </div>
    </form>
  );
}
