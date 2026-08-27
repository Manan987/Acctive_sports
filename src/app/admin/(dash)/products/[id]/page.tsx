import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseArray } from "@/lib/utils";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-ink-500 hover:text-flame-500">Back to products</Link>
      <h1 className="mb-6 mt-2 font-display text-2xl font-extrabold">Edit product</h1>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: product.id,
          name: product.name,
          description: product.description ?? "",
          categoryId: product.categoryId,
          images: parseArray(product.images),
          fabrics: parseArray(product.fabrics),
          sizes: parseArray(product.sizes),
          sports: parseArray(product.sports),
          price: product.price ?? null,
          moq: product.moq,
          sku: product.sku ?? "",
          featured: product.featured,
          published: product.published,
        }}
      />
    </div>
  );
}
