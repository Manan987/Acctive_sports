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

          {/* Price */}
          {price ? (
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-ink-900 dark:text-white">
                {price}
              </span>
              <span className="text-sm text-ink-500 dark:text-ink-400">per piece</span>
              {product.moq > 1 && (
                <span className="ml-2 rounded-full bg-flame-500/10 px-3 py-1 text-xs font-semibold text-flame-600 dark:text-flame-400">
                  Bulk: {product.moq}+ pcs
                </span>
              )}
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
