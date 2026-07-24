import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional().default(""),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).default([]),
  fabrics: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  sports: z.array(z.string()).default([]),
  price: z.union([z.number(), z.null()]).optional(),
  moq: z.number().int().positive().default(50),
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
