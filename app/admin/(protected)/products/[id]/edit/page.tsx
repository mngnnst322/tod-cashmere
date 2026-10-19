import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { guardPage } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { listCategories } from "@/lib/products";
import { updateProduct } from "@/lib/admin-actions";
import { ProductForm } from "../../product-form";
import AdminProductsPage from "../../page";

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]/edit">,
) {
  await guardPage("admin");
  const { id } = await props.params;
  const db = await getDb();
  const [product, categories] = await Promise.all([
    db.query.products.findFirst({ where: eq(products.id, id) }),
    listCategories(),
  ]);
  if (!product) notFound();

  // The form opens as a drawer over the product list.
  return (
    <>
      <AdminProductsPage />
      <ProductForm action={updateProduct.bind(null, id)} categories={categories} product={product} />
    </>
  );
}
