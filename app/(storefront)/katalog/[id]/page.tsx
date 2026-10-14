import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogItem } from "@/lib/catalog";
import {
  catalogColors,
  catalogItemName,
  catalogMaterial,
  catalogStrings,
  catalogTypeName,
} from "@/lib/catalog-i18n";
import { getLang } from "@/lib/i18n-server";
import { CatalogItemHeart } from "@/components/catalog-grid";

export async function generateMetadata(props: PageProps<"/katalog/[id]">) {
  const { id } = await props.params;
  const [item, lang] = await Promise.all([getCatalogItem(id), getLang()]);
  return { title: item ? `${catalogItemName(item.name, lang)} – Tod Cashmere` : "Tod Cashmere" };
}

// One catalog item, laid out like its card: large photo, then the details
// entered in Admin → Каталог.
export default async function CatalogItemPage(props: PageProps<"/katalog/[id]">) {
  const { id } = await props.params;
  const [item, lang] = await Promise.all([getCatalogItem(id), getLang()]);
  if (!item) notFound();
  const s = catalogStrings(lang);

  return (
    <section className="section katalog-item">
      <Link href="/katalog?gender=all" className="katalog-item-back">
        ← {s.back}
      </Link>
      <div className="katalog-item-image">
        {item.image && (
          <Image src={item.image} alt={catalogItemName(item.name, lang)} fill priority sizes="(max-width: 600px) 100vw, 520px" />
        )}
        <CatalogItemHeart id={item.id} strings={s} />
      </div>
      <div className="katalog-item-type">{catalogTypeName(item.type, lang)}</div>
      <h1 className="katalog-item-name">{catalogItemName(item.name, lang)}</h1>
      {item.code && <div className="katalog-item-code">{item.code}</div>}
      <div className="katalog-item-details">
        {item.material && <div>{catalogMaterial(item.material, lang)}</div>}
        {item.colors && (
          <div>
            {s.color}: {catalogColors(item.colors, lang)}
          </div>
        )}
        {item.sizes && (
          <div>
            {s.size}: {item.sizes}
          </div>
        )}
      </div>
    </section>
  );
}
