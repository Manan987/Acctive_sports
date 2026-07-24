import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema, slugify } from "@/lib/productSchema";

// Admin: create product
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const d = parsed.data;

  // Ensure unique slug
  let base = slugify(d.name);
  let slug = base;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }

  const product = await prisma.product.create({
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
  return NextResponse.json({ product }, { status: 201 });
}
