import { unstable_cache } from "next/cache";
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
  createdAt: string | null;
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
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
  };
}

// SQLite's LIKE is case-insensitive for ASCII, so `contains` "just works" in
// dev. PostgreSQL's LIKE is case-SENSITIVE, so the same search silently stops
// matching once deployed — searching "jersey" would miss "Jersey". Postgres
// needs an explicit `mode: "insensitive"`, which SQLite rejects outright, so
// the flag has to be chosen from the live connection string.
const isPostgres = /^postgres(ql)?:\/\//i.test(process.env.DATABASE_URL || "");
const insensitive = isPostgres ? ({ mode: "insensitive" } as const) : {};

// The site layout renders the category nav on EVERY page, and the layout is
// force-dynamic — so this query used to run on every single request, including
// a COUNT per category. The category list changes rarely; cache it briefly.
export const getCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      orderBy: { order: "asc" },
      // The nav badge previously counted drafts too, so a category showing
      // "12 designs" could open onto a page with 9.
      include: { _count: { select: { products: { where: { published: true } } } } },
    }),
  ["categories-with-counts"],
  { revalidate: 60, tags: ["categories"] }
);

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

export const PRODUCTS_PER_PAGE = 24;

export type ProductPage = {
  products: ProductView[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export async function getProducts(
  opts: {
    category?: string;
    sport?: string;
    fabric?: string;
    q?: string;
    sort?: string;
    page?: number | string;
    perPage?: number;
  } = {}
): Promise<ProductPage> {
  const perPage = Math.min(Math.max(opts.perPage ?? PRODUCTS_PER_PAGE, 1), 60);

  const where: any = { published: true };
  if (opts.category) where.category = { slug: opts.category };

  const q = opts.q?.trim();
  if (q) {
    where.OR = [
      { name: { contains: q, ...insensitive } },
      { description: { contains: q, ...insensitive } },
      { sku: { contains: q, ...insensitive } },
    ];
  }

  // sports/fabrics are JSON arrays stored as text. Matching on the quoted value
  // (`"Cricket"`) pins it to a whole array element, so "Cricket" can't match a
  // hypothetical "Cricket Training". Doing this in SQL rather than in JS is
  // what makes real pagination possible — the previous version loaded every
  // published product into memory on every catalogue request just to filter it.
  if (opts.sport) where.sports = { contains: JSON.stringify(opts.sport) };
  if (opts.fabric) where.fabrics = { contains: JSON.stringify(opts.fabric) };

  const orderBy =
    opts.sort === "name"
      ? { name: "asc" as const }
      : opts.sort === "featured"
      ? { featured: "desc" as const }
      : { createdAt: "desc" as const };

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // Clamp out-of-range/garbage `?page=` values instead of rendering an empty grid.
  const requested = Number(opts.page);
  const page = Number.isFinite(requested)
    ? Math.min(Math.max(Math.trunc(requested), 1), totalPages)
    : 1;

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return { products: products.map(toView), total, page, perPage, totalPages };
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  // An unpublished product must not be reachable by guessing its URL.
  if (!p || !p.published) return null;
  return toView(p);
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<ProductView[]> {
  const products = await prisma.product.findMany({
    where: { categoryId, published: true, NOT: { id: excludeId } },
    include: { category: true },
    // Without an explicit order the DB may return a different set each request,
    // which makes the "More from…" rail flicker between renders.
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toView);
}
