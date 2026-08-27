import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductGallery } from "@/components/client/ProductGallery";
import { AddToCart } from "@/components/client/AddToCart";
import { ProductCard } from "@/components/client/ProductCard";
import { ProductTabs } from "@/components/client/ProductTabs";
import { SizeGuide } from "@/components/client/SizeGuide";
import { formatINR } from "@/lib/utils";
import { unitPrice } from "@/lib/pricing";
import { site, DISCOUNTS } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

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
  const singlePrice = unitPrice(product.price, 1);
  const bulkPrice = unitPrice(product.price, DISCOUNTS.bulk.minQty);

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
      // Advertise the price a buyer can actually transact at. Publishing MRP
      // here while the page displays the discounted figure gets the listing
      // flagged for price mismatch in Google Merchant / rich results.
      price: singlePrice ?? undefined,
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

          {/* Price. One headline figure with the MRP struck beside it, then the
              bulk tier as a supporting row — a buyer should read the number they
              pay today before anything else. */}
          {product.price != null && singlePrice != null ? (
            <div className="mt-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="nums text-4xl font-extrabold text-ink-900 dark:text-white">
                  {formatINR(singlePrice)}
                </span>
                <span className="nums text-base text-ink-400 line-through">
                  {formatINR(product.price)}
                </span>
                <span className="rounded-full bg-flame-500/10 px-2.5 py-1 text-xs font-bold text-flame-600 dark:text-flame-400">
                  Save {DISCOUNTS.single.pct}%
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                per piece, excluding customization
              </p>

              {bulkPrice != null && (
                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-green-500/25 bg-green-50 px-4 py-3 dark:border-green-800/40 dark:bg-green-950/25">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-green-600 dark:text-green-400">
                      <Icon name="percent" size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-green-800 dark:text-green-300">
                        {DISCOUNTS.bulk.minQty}+ pieces — save {DISCOUNTS.bulk.pct}%
                      </p>
                      <p className="text-xs text-green-700/80 dark:text-green-500">
                        Applied automatically at checkout across your whole order
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="nums text-2xl font-extrabold text-green-700 dark:text-green-400">
                      {formatINR(bulkPrice)}
                    </p>
                    <p className="nums text-[11px] text-green-600 dark:text-green-500">
                      save {formatINR(product.price - bulkPrice)}/pc
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-5">
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
            {([
              { icon: "palette", label: "Fully customizable" },
              { icon: "truck", label: "Pan-India delivery" },
              { icon: "factory", label: "Factory direct" },
            ] as const).map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-flame-500/10 text-flame-500">
                  <Icon name={b.icon} size={19} />
                </span>
                {b.label}
              </div>
            ))}
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
