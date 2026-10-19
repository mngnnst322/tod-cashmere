import { guardPage } from "@/lib/auth-guard";
import { listCategories } from "@/lib/products";
import { createProduct } from "@/lib/admin-actions";
import { ProductForm } from "../product-form";
import AdminProductsPage from "../page";

export default async function NewProductPage() {
  await guardPage("admin");
  const categories = await listCategories();
  // The form opens as a drawer over the product list.
  return (
    <>
      <AdminProductsPage />
      <ProductForm action={createProduct} categories={categories} />
    </>
  );
}
