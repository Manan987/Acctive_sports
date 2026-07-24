import { z } from "zod";

export const enquiryItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  qty: z.number().int().positive(),
  size: z.string().optional().default(""),
  fabric: z.string().optional().default(""),
  note: z.string().optional(),
});

export const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  company: z.string().optional(),
  message: z.string().optional(),
  source: z.enum(["quote", "contact"]).default("quote"),
  items: z.array(enquiryItemSchema).default([]),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
