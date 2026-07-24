import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema, slugify } from "@/lib/productSchema";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.product.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const d = parsed.data;

  // Keep slug stable unless name changed; ensure uniqueness
  let slug = existing.slug;
  if (slugify(d.name) !== slugify(existing.name)) {
    let base = slugify(d.name);
    slug = base;
    let n = 1;
    while (await prisma.product.findFirst({ where: { slug, NOT: { id: params.id } } })) {
      slug = `${base}-${n++}`;
    }
  }

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
  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
