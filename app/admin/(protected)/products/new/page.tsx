import { listCategories } from "@/lib/products";
import { createProduct } from "@/lib/admin-actions";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const categories = await listCategories();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New product</h1>
      <ProductForm action={createProduct} categories={categories} />
    </div>
  );
}
