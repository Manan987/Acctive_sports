import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/client/ProductCard";
import { CatalogueFilters } from "@/components/client/CatalogueFilters";
import { FABRICS, SPORTS } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Browse ACCTIVE Sports custom sportswear catalogue — collar & round-neck jerseys, shorts, lowers and tracksuits. Filter by category, sport and fabric.",
};

type SearchParams = {
  category?: string;
  sport?: string;
  fabric?: string;
  q?: string;
  sort?: string;
};

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(searchParams),
  ]);

  const catList = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    count: c._count.products,
  }));

  return (
    <div className="container-x py-10 md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Catalogue</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          {products.length} design{products.length === 1 ? "" : "s"} — every piece is
          fully customizable with your team name, numbers, logo and colours.
        </p>
      </header>

      <div className="mt-8">
        <CatalogueFilters categories={catList} sports={SPORTS} fabrics={FABRICS} />
      </div>

      {products.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-semibold">No products match your filters.</p>
          <p className="mt-1 text-ink-500 dark:text-ink-400">
            Try clearing filters or searching a different term.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
