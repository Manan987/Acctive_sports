import Image from "next/image";
import Link from "next/link";
import type { ProductView } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { QuickQuoteButton } from "./QuickQuoteButton";

export function ProductCard({ product }: { product: ProductView }) {
  const img = product.images[0] || "/placeholder-product.svg";
  const imgBack = product.images[1] || img;
  const price = formatINR(product.price);

  return (
    <div className="group card overflow-hidden transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/10">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-ink-100 dark:bg-ink-800">
          {/* front image */}
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          {/* back image (revealed on hover) */}
          <Image
            src={imgBack}
            alt=""
            fill
            aria-hidden
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          {product.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-flame-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
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
          <p className="text-[11px] font-semibold uppercase tracking-wide text-flame-500">
            {product.categoryName}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-ink-900 hover:text-flame-500 dark:text-white">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-ink-500 dark:text-ink-400">MOQ {product.moq} pcs</span>
          {price ? (
            <span className="text-sm font-bold text-ink-900 dark:text-white">{price}</span>
          ) : (
            <span className="text-xs font-semibold text-flame-500">On request</span>
          )}
        </div>
        <div className="mt-3">
          <QuickQuoteButton
            productId={product.id}
            name={product.name}
            slug={product.slug}
            image={img}
            size={product.sizes[0] ?? "L"}
            fabric={product.fabrics[0] ?? ""}
            moq={product.moq}
          />
        </div>
      </div>
    </div>
  );
}
