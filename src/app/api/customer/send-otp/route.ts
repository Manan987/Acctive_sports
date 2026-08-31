import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { serverError, readJson } from "@/lib/apiError";

export const dynamic = "force-dynamic";

/**
 * POST /api/customer/send-otp
 *
 * Accepts { phone, name, email? }. Creates/upserts a Customer record,
 * generates a 6-digit OTP, hashes and stores it (5-min expiry), and
 * returns it in dev mode (in production, plug an SMS gateway here).
 */

const schema = z.object({
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(15)
    .transform((v) => v.replace(/\D/g, "")), // strip non-digits
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
});

/** Generates a 6-digit numeric OTP. */
function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  // Rate limit: 3 OTP sends per phone per 5 minutes
  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { phone, name, email } = parsed.data;

  // IP + phone-based rate limiting
  const ipLimit = rateLimit(`otp-ip:${clientIp(req)}`, 10, 300_000);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  const phoneLimit = rateLimit(`otp-phone:${phone}`, 3, 300_000);
  if (!phoneLimit.ok) {
    return NextResponse.json(
      { error: "OTP already sent. Please wait before requesting again." },
      { status: 429 }
    );
  }

  try {
    // Upsert customer — create if first time, update name/email if returning
    const customer = await prisma.customer.upsert({
      where: { phone },
      create: { phone, name, email: email || null },
      update: { name, ...(email ? { email } : {}) },
    });

    // Invalidate any unexpired OTPs for this phone
    await prisma.otp.updateMany({
      where: { phone, verified: false, expiresAt: { gt: new Date() } },
      data: { expiresAt: new Date() }, // expire immediately
    });

    // Generate and hash the OTP
    const plainOtp = generateOtp();
    const hashedOtp = await bcrypt.hash(plainOtp, 6); // lightweight hash for OTPs

    await prisma.otp.create({
      data: {
        phone,
        code: hashedOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        customerId: customer.id,
      },
    });

    // ─── SMS DELIVERY ─────────────────────────────────────────────
    // TODO: In production, replace this with your SMS gateway:
    //   await sendSms(phone, `Your ACCTIVE Sports OTP is: ${plainOtp}`);
    //
    // For now, the OTP is returned in the response (dev mode only)
    // and logged to the server console.
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.log(`\n📱 OTP for ${phone}: ${plainOtp}\n`);
    }

    return NextResponse.json(
      {
        ok: true,
        message: "OTP sent successfully",
        // Only expose the OTP in development — never in production
        ...(isDev ? { otp: plainOtp } : {}),
      },
      { status: 200 }
    );
  } catch (err) {
    return serverError("customer.send-otp", err);
  }
}
