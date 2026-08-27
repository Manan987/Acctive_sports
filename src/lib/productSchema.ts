import { z } from "zod";
import { prisma } from "./prisma";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional().default(""),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).default([]),
  fabrics: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  sports: z.array(z.string()).default([]),
  price: z.union([z.number(), z.null()]).optional(),
  moq: z.number().int().positive().default(1),
  sku: z.string().optional().default(""),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Find a free product slug. The previous inline loop ran `while (found)` with
// no ceiling, so a pathological name could spin indefinitely; and a name that
// slugifies to an empty string (e.g. "!!!") produced a blank slug that then
// collided with itself.
export async function uniqueProductSlug(name: string, excludeId?: string) {
  const base = slugify(name) || "product";
  for (let n = 0; n < 50; n++) {
    const slug = n === 0 ? base : `${base}-${n}`;
    const clash = await prisma.product.findFirst({
      where: excludeId ? { slug, NOT: { id: excludeId } } : { slug },
      select: { id: true },
    });
    if (!clash) return slug;
  }
  // Give up guessing and append a random suffix rather than loop forever.
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}
