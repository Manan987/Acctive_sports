import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-ink-500 hover:text-flame-500">← Back to products</Link>
      <h1 className="mb-6 mt-2 font-display text-2xl font-extrabold">Add product</h1>
      <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
