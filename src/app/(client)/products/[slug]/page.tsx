import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductGallery } from "@/components/client/ProductGallery";
import { AddToQuote } from "@/components/client/AddToQuote";
import { ProductCard } from "@/components/client/ProductCard";
import { formatINR } from "@/lib/utils";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description ?? site.description,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id, 4);
  const price = formatINR(product.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.categoryName,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price ?? undefined,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="container-x py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
        <Link href="/" className="hover:text-flame-500">Home</Link>
        <span>/</span>
        <Link href="/catalogue" className="hover:text-flame-500">Catalogue</Link>
        <span>/</span>
        <Link href={`/catalogue?category=${product.categorySlug}`} className="hover:text-flame-500">
          {product.categoryName}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-flame-500">
            {product.categoryName}
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">
            {product.name}
          </h1>

          {price ? (
            <p className="mt-3 text-2xl font-bold">
              {price} <span className="text-sm font-normal text-ink-500">/ piece</span>
            </p>
          ) : (
            <p className="mt-3 inline-flex rounded-full bg-flame-500/10 px-3 py-1 text-sm font-semibold text-flame-500">
              Bulk pricing on request
            </p>
          )}

          {product.description && (
            <p className="mt-4 text-ink-600 dark:text-ink-300">{product.description}</p>
          )}

          {/* Meta chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {product.sports.map((s) => (
              <span key={s} className="badge">{s}</span>
            ))}
          </div>

          <AddToQuote product={product} />

          {/* Trust row */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-ink-100 pt-6 text-center text-xs text-ink-500 dark:border-ink-800 dark:text-ink-400">
            <div><div className="text-lg">🎨</div>Fully customizable</div>
            <div><div className="text-lg">🚚</div>Pan-India delivery</div>
            <div><div className="text-lg">🏭</div>Factory direct</div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-extrabold sm:text-2xl">
            More from {product.categoryName}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
