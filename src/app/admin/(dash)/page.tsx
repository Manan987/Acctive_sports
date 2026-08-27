import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, published, categories, enquiries, newEnquiries] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.category.count(),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
  ]);

  const recent = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Products", value: products, href: "/admin/products" },
    { label: "Published", value: published, href: "/admin/products" },
    { label: "Categories", value: categories, href: "/admin/products" },
    { label: "New enquiries", value: newEnquiries, href: "/admin/enquiries", accent: true },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold">Dashboard</h1>
        <Link href="/admin/products/new" className="btn-primary">+ Add product</Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 transition hover:-translate-y-0.5">
            <p className="text-sm text-ink-500 dark:text-ink-400">{s.label}</p>
            <p className={`mt-1 font-display text-3xl font-extrabold ${s.accent ? "text-flame-500" : ""}`}>
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm font-semibold text-flame-500 hover:underline">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-ink-500">No enquiries yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink-100 dark:divide-ink-800">
            {recent.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold">{e.name} <span className="font-normal text-ink-400">· {e.source}</span></p>
                  <p className="text-xs text-ink-500">{e.email} · {e.phone}</p>
                </div>
                <span className="badge">{e.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
