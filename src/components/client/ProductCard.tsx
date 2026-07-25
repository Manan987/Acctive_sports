import Image from "next/image";
import Link from "next/link";
import type { ProductView } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { QuickAddToCart } from "./QuickAddToCart";

export function ProductCard({ product }: { product: ProductView }) {
  const img = product.images[0] || "/placeholder-product.svg";
  const imgBack = product.images[1] || img;
  const price = formatINR(product.price);

  return (
    <div className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink-900/10">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-ink-100 dark:bg-ink-800">
          {/* Front image */}
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          {/* Back image (hover reveal) */}
          <Image
            src={imgBack}
            alt=""
            fill
            aria-hidden
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* Badges */}
          {product.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-flame-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
              Featured
            </span>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-ink-700 backdrop-blur dark:bg-ink-900/90 dark:text-ink-200">
            Customizable
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <p className="text-[11px] font-bold uppercase tracking-widest text-flame-500">
            {product.categoryName}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-ink-900 hover:text-flame-500 dark:text-white">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="mt-2 flex items-center justify-between">
          {price ? (
            <span className="text-base font-extrabold text-ink-900 dark:text-white">{price}</span>
          ) : (
            <span className="text-xs font-semibold text-flame-500">Price on request</span>
          )}
          {product.sizes.length > 0 && (
            <span className="text-[11px] text-ink-400">
              {product.sizes.slice(0, 4).join(" · ")}{product.sizes.length > 4 ? " …" : ""}
            </span>
          )}
        </div>

        {/* Quick Add to Cart */}
        <div className="mt-3">
          <QuickAddToCart
            productId={product.id}
            name={product.name}
            slug={product.slug}
            image={img}
            sizes={product.sizes}
            fabric={product.fabrics[0] ?? ""}
            price={product.price}
          />
        </div>
      </div>
    </div>
  );
}
