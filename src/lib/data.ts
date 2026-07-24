import { prisma } from "./prisma";
import { parseArray } from "./utils";

export type ProductView = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string[];
  fabrics: string[];
  sizes: string[];
  sports: string[];
  price: number | null;
  moq: number;
  featured: boolean;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
};

function toView(p: any): ProductView {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    images: parseArray(p.images),
    fabrics: parseArray(p.fabrics),
    sizes: parseArray(p.sizes),
    sports: parseArray(p.sports),
    price: p.price ?? null,
    moq: p.moq,
    featured: p.featured,
    categoryId: p.categoryId,
    categoryName: p.category?.name ?? "",
    categorySlug: p.category?.slug ?? "",
  };
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getFeaturedProducts(limit = 8): Promise<ProductView[]> {
  const products = await prisma.product.findMany({
    where: { published: true, featured: true },
    include: { category: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toView);
}

export async function getLatestProducts(limit = 10): Promise<ProductView[]> {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: { category: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toView);
}

export async function getProducts(opts: {
  category?: string;
  sport?: string;
  fabric?: string;
  q?: string;
  sort?: string;
} = {}): Promise<ProductView[]> {
  const where: any = { published: true };
  if (opts.category) where.category = { slug: opts.category };
  if (opts.q) {
    where.name = { contains: opts.q };
  }
  // sport/fabric are stored as JSON strings; filter in app layer below

  let products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy:
      opts.sort === "name"
        ? { name: "asc" }
        : opts.sort === "featured"
        ? { featured: "desc" }
        : { createdAt: "desc" },
  });

  let views = products.map(toView);
  if (opts.sport) views = views.filter((p) => p.sports.includes(opts.sport!));
  if (opts.fabric) views = views.filter((p) => p.fabrics.includes(opts.fabric!));
  return views;
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  return p ? toView(p) : null;
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<ProductView[]> {
  const products = await prisma.product.findMany({
    where: { categoryId, published: true, NOT: { id: excludeId } },
    include: { category: true },
    take: limit,
  });
  return products.map(toView);
}
