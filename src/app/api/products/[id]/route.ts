import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema, slugify, uniqueProductSlug } from "@/lib/productSchema";
import { serverError, readJson } from "@/lib/apiError";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const category = await prisma.category.findUnique({ where: { id: d.categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Selected category no longer exists" }, { status: 422 });
    }

    // Keep the slug stable unless the name changed — renaming silently would
    // break every existing link to the product.
    const slug =
      slugify(d.name) === slugify(existing.name)
        ? existing.slug
        : await uniqueProductSlug(d.name, params.id);

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: d.name,
        slug,
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
    // Publishing/unpublishing or moving a product changes the cached counts.
    revalidateTag("categories");
    return NextResponse.json({ product });
  } catch (err) {
    return serverError("products.PUT", err);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // The old handler swallowed every failure with `.catch(() => null)` and
    // always reported success, so a delete that hit a DB error looked like it
    // worked until the admin reloaded and saw the product still there.
    await prisma.product.delete({ where: { id: params.id } });
    revalidateTag("categories");
    return NextResponse.json({ ok: true });
  } catch (err) {
    if ((err as { code?: string })?.code === "P2025") {
      // Already gone — the caller's intent is satisfied.
      return NextResponse.json({ ok: true });
    }
    return serverError("products.DELETE", err);
  }
}
