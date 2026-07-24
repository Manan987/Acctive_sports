import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { parseArray } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold">Products <span className="text-ink-400">({products.length})</span></h1>
        <Link href="/admin/products/new" className="btn-primary">+ Add product</Link>
      </div>

      <div className="mt-6 overflow-hidden card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 bg-ink-50 text-left text-xs uppercase text-ink-500 dark:border-ink-800 dark:bg-ink-950">
              <tr>
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">MOQ</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {products.map((p) => {
                const img = parseArray(p.images)[0] || "/placeholder-product.svg";
                return (
                  <tr key={p.id} className="hover:bg-ink-50 dark:hover:bg-ink-950/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800">
                          <Image src={img} alt="" fill className="object-cover" />
                        </div>
                        <span className="line-clamp-1 font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-ink-500">{p.category.name}</td>
                    <td className="p-3 text-ink-500">{p.moq}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        <span className={`badge ${p.published ? "bg-green-500/10 text-green-600" : ""}`}>
                          {p.published ? "Published" : "Draft"}
                        </span>
                        {p.featured && <span className="badge bg-flame-500/10 text-flame-500">Featured</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${p.id}`} className="text-flame-500 hover:underline">Edit</Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <p className="p-8 text-center text-ink-500">No products yet. Add your first one.</p>
        )}
      </div>
    </div>
  );
}
