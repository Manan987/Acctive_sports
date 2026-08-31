import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createCustomerSession } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { serverError, readJson } from "@/lib/apiError";

export const dynamic = "force-dynamic";

/**
 * POST /api/customer/verify-otp
 *
 * Accepts { phone, code }. Verifies the OTP against the hashed value in DB,
 * checks expiry and attempt count (max 3). On success: marks customer as
 * verified, creates a JWT session cookie, and returns the customer profile.
 */

const schema = z.object({
  phone: z
    .string()
    .trim()
    .min(10)
    .max(15)
    .transform((v) => v.replace(/\D/g, "")),
  code: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits"),
});

const MAX_ATTEMPTS = 3;

export async function POST(req: Request) {
  const ipLimit = rateLimit(`verify-ip:${clientIp(req)}`, 15, 300_000);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid 6-digit OTP.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { phone, code } = parsed.data;

  try {
    // Find the latest unexpired, unverified OTP for this phone
    const otp = await prisma.otp.findFirst({
      where: {
        phone,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return NextResponse.json(
        { error: "OTP expired or not found. Please request a new one." },
        { status: 410 }
      );
    }

    // Check attempt count
    if (otp.attempts >= MAX_ATTEMPTS) {
      // Expire this OTP — force the user to request a new one
      await prisma.otp.update({
        where: { id: otp.id },
        data: { expiresAt: new Date() },
      });
      return NextResponse.json(
        { error: "Too many wrong attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    // Verify the code
    const isValid = await bcrypt.compare(code, otp.code);

    if (!isValid) {
      // Increment attempt counter
      await prisma.otp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      const remaining = MAX_ATTEMPTS - otp.attempts - 1;
      return NextResponse.json(
        { error: `Incorrect OTP. ${remaining} attempt(s) remaining.` },
        { status: 401 }
      );
    }

    // OTP is valid — mark as verified
    await prisma.otp.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    // Mark customer as verified and fetch profile
    const customer = await prisma.customer.update({
      where: { phone },
      data: { verified: true },
    });

    // Create JWT session
    await createCustomerSession({
      sub: customer.id,
      phone: customer.phone,
      name: customer.name,
      email: customer.email ?? undefined,
    });

    return NextResponse.json({
      ok: true,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        city: customer.city,
      },
    });
  } catch (err) {
    return serverError("customer.verify-otp", err);
  }
}
