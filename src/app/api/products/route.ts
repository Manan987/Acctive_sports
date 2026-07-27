import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema, uniqueProductSlug } from "@/lib/productSchema";
import { serverError, readJson } from "@/lib/apiError";

export const dynamic = "force-dynamic";

// Admin: create product
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await readJson(req);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const d = parsed.data;

  try {
    // A bad categoryId used to surface as an unhandled foreign-key crash.
    const category = await prisma.category.findUnique({ where: { id: d.categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Selected category no longer exists" }, { status: 422 });
    }

    const product = await prisma.product.create({
      data: {
        name: d.name,
        slug: await uniqueProductSlug(d.name),
        description: d.description || null,
        categoryId: d.categoryId,
        images: JSON.stringify(d.images),
        fabrics: JSON.stringify(d.fabrics),
        sizes: JSON.stringify(d.sizes),
        sports: JSON.stringify(d.sports),
        price: d.price ?? null,
        moq: d.moq,
        sku: d.sku || null,
        featured: d.featured,
        published: d.published,
      },
    });
    // Product counts are baked into the cached category nav.
    revalidateTag("categories");
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    return serverError("products.POST", err);
  }
}
