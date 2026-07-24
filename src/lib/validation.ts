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
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email").max(160),
  phone: z.string().min(7, "Enter a valid phone number").max(40),
  company: z.string().max(160).optional(),
  message: z.string().max(4000).optional(),
  source: z.enum(["quote", "contact"]).default("quote"),
  items: z.array(enquiryItemSchema).max(100).default([]),
  // Honeypot: real users never fill this hidden field; bots do.
  website: z.string().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
