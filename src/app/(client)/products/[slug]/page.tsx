import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductGallery } from "@/components/client/ProductGallery";
import { AddToCart } from "@/components/client/AddToCart";
import { ProductCard } from "@/components/client/ProductCard";
import { ProductTabs } from "@/components/client/ProductTabs";
import { SizeGuide } from "@/components/client/SizeGuide";
import { formatINR, applyDiscount } from "@/lib/utils";
import { site, DISCOUNTS } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    // Next 14 commits the HTTP status before a dynamically-rendered page can
    // reach notFound(), so a missing product answers 200 with the not-found UI
    // — a soft 404 that search engines will happily index. We cannot change
    // the status from here, but we can keep the page out of the index.
    return { title: "Product not found", robots: { index: false, follow: false } };
  }
  return {
    title: product.name,
    description: product.description ?? site.description,
    // Without this every product inherits the root layout's `canonical: "/"`,
    // telling Google that all 145 product pages are duplicates of the homepage.
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      url: `${site.url}/products/${product.slug}`,
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

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${site.url}/catalogue` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.categoryName,
        item: `${site.url}/catalogue?category=${product.categorySlug}`,
      },
      { "@type": "ListItem", position: 4, name: product.name, item: `${site.url}/products/${product.slug}` },
    ],
  };

  return (
    <div className="container-x py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
        <Link href="/" className="hover:text-flame-500">Home</Link>
        <span>/</span>
        <Link href="/catalogue" className="hover:text-flame-500">Shop</Link>
        <span>/</span>
        <Link href={`/catalogue?category=${product.categorySlug}`} className="hover:text-flame-500">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-ink-800 dark:text-ink-200">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-flame-500">
            {product.categoryName}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            {product.name}
          </h1>

          {/* Price — discount tiers */}
          {product.price ? (
            <div className="mt-5 space-y-3">
              {/* Section label */}
              <p className="text-xs font-bold uppercase tracking-widest text-ink-400">
                Pricing &amp; Discounts
              </p>

              {/* Single piece */}
              {(() => {
                const s = applyDiscount(product.price, DISCOUNTS.single.pct);
                return (
                  <div className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 dark:border-ink-700 dark:bg-ink-800/50">
                    <div>
                      <p className="text-sm font-bold text-ink-900 dark:text-white">1 piece</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400">Single order</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ink-400 line-through">{s.original}</p>
                      <p className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">
                        {s.sale}
                        <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                          -{DISCOUNTS.single.pct}% OFF
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Bulk order */}
              {(() => {
                const b = applyDiscount(product.price, DISCOUNTS.bulk.pct);
                const saved = product.price - (b.amount ?? product.price);
                return (
                  <div className="flex items-center justify-between rounded-xl border-2 border-green-400/40 bg-green-50 px-4 py-3 dark:border-green-700/40 dark:bg-green-950/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">5+ pieces 🔥</p>
                        <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">BEST DEAL</span>
                      </div>
                      <p className="text-xs text-green-600/80 dark:text-green-500">Bulk order (5+ pieces) discount</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ink-400 line-through">{b.original}</p>
                      <p className="font-display text-2xl font-extrabold text-green-700 dark:text-green-400">
                        {b.sale}
                        <span className="ml-2 rounded-full bg-green-600/15 px-2 py-0.5 text-xs font-bold text-green-700 dark:text-green-400">
                          -{DISCOUNTS.bulk.pct}% OFF
                        </span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-green-600 dark:text-green-500">
                        Save {formatINR(saved)} per piece vs MRP
                      </p>
                    </div>
                  </div>
                );
              })()}

              <p className="text-[11px] text-ink-400 dark:text-ink-500">
                * Discounts applied automatically. Prices are per piece excluding customization.
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <span className="inline-flex rounded-full bg-flame-500/10 px-4 py-1.5 text-sm font-semibold text-flame-600 dark:text-flame-400">
                Price on request
              </span>
            </div>
          )}

          {product.description && (
            <p className="mt-4 leading-relaxed text-ink-600 dark:text-ink-300">
              {product.description}
            </p>
          )}

          {/* Sport tags */}
          {product.sports.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {product.sports.map((s) => (
                <Link
                  key={s}
                  href={`/catalogue?sport=${encodeURIComponent(s)}`}
                  className="badge hover:border-flame-500 hover:text-flame-500 transition"
                >
                  {s}
                </Link>
              ))}
            </div>
          )}

          {/* Fabric & size guide row */}
          <div className="mt-5 flex items-center justify-between border-y border-ink-100 py-3 dark:border-ink-800">
            <span className="text-sm text-ink-500 dark:text-ink-400">
              Fabrics:{" "}
              <span className="font-semibold text-ink-700 dark:text-ink-200">
                {product.fabrics.join(", ") || "On request"}
              </span>
            </span>
            <SizeGuide />
          </div>

          {/* Add to Cart */}
          <AddToCart product={product} />

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-ink-100 pt-6 text-center text-xs text-ink-500 dark:border-ink-800 dark:text-ink-400">
            <div>
              <div className="mb-1 text-2xl">🎨</div>
              Fully customizable
            </div>
            <div>
              <div className="mb-1 text-2xl">🚚</div>
              Pan-India delivery
            </div>
            <div>
              <div className="mb-1 text-2xl">🏭</div>
              Factory direct
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed details */}
      <ProductTabs product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
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
