import { z } from "zod";

export const enquiryItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().max(200),
  slug: z.string().max(200).optional(),
  // Cap per-line quantity: without an upper bound a bot can post qty
  // 1e12 and the stored order total becomes meaningless.
  qty: z.number().int().positive().max(100_000),
  size: z.string().max(20).optional().default(""),
  fabric: z.string().max(60).optional().default(""),
  note: z.string().max(500).optional(),
});

export const PAYMENT_METHODS = ["upi", "bank_transfer", "cod", "razorpay"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(40)
    .regex(/^[0-9+()\-.\s]+$/, "Enter a valid phone number"),
  company: z.string().trim().max(160).optional(),
  message: z.string().trim().max(4000).optional(),
  source: z.enum(["quote", "contact", "cart"]).default("cart"),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  items: z.array(enquiryItemSchema).max(100).default([]),
  // Honeypot: real users never fill this hidden field; bots do.
  website: z.string().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
