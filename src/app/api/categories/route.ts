import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { serverError, readJson } from "@/lib/apiError";
import { z } from "zod";

// Without this, Next treats a GET handler with no dynamic API as static and
// bakes the category list into the build output — new categories would never
// appear until the next deploy.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ categories });
  } catch (err) {
    return serverError("categories.GET", err);
  }
}

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional(),
  order: z.number().int().min(0).max(9999).optional(),
});

// Admin: create a category
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await readJson(req);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const d = parsed.data;

  // A name like "!!!" slugified to an empty string, which then collided with
  // any other unslugifiable name on the unique index.
  const slug = slugify(d.name) || `category-${Date.now().toString(36)}`;

  try {
    // Creating a duplicate used to throw a raw unique-constraint error.
    const clash = await prisma.category.findUnique({ where: { slug } });
    if (clash) {
      return NextResponse.json(
        { error: "A category with that name already exists." },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: d.name,
        slug,
        description: d.description || null,
        order: d.order ?? 0,
      },
    });
    // The nav category list is cached (see getCategories) — drop it so the new
    // category appears immediately rather than up to a minute later.
    revalidateTag("categories");
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    return serverError("categories.POST", err);
  }
}
