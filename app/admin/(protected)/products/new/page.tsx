import { guardPage } from "@/lib/auth-guard";
import { listCategories } from "@/lib/products";
import { createProduct } from "@/lib/admin-actions";
import { PageBody, PageHeader } from "../../../ui";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  await guardPage("admin");
  const categories = await listCategories();
  return (
    <>
      <PageHeader title="Бараа нэмэх" subtitle="Шинэ бүтээгдэхүүн 4 хэл дээр" />
      <PageBody>
        <ProductForm action={createProduct} categories={categories} />
      </PageBody>
    </>
  );
}
