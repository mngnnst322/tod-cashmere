import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { listCategories } from "@/lib/products";
import { updateProduct } from "@/lib/admin-actions";
import { ProductForm } from "../../product-form";

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]/edit">,
) {
  const { id } = await props.params;
  const db = await getDb();
  const [product, categories] = await Promise.all([
    db.query.products.findFirst({ where: eq(products.id, id) }),
    listCategories(),
  ]);
  if (!product) notFound();

  const action = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit product</h1>
      <ProductForm action={action} categories={categories} product={product} />
    </div>
  );
}
