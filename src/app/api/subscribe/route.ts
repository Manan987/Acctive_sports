import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { serverError, readJson } from "@/lib/apiError";

export const dynamic = "force-dynamic";

/**
 * Newsletter / new-design-alert signup.
 *
 * The banner used to call `setStatus("done")` on submit and never send the
 * address anywhere — a visitor was told "You're on the list!" and was not on
 * any list. It now records a real enquiry so the address lands in the admin
 * panel alongside every other lead.
 */

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(160),
  // Honeypot: real users never fill this hidden field; bots do.
  website: z.string().optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`subscribe:${clientIp(req)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } }
    );
  }

  const body = await readJson(req);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });
  }

  const { email, website } = parsed.data;

  // Honeypot tripped → accept silently so the bot learns nothing, store nothing.
  if (website && website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    const normalised = email.toLowerCase();

    // Re-subscribing should not create a second row for the same address.
    const existing = await prisma.enquiry.findFirst({
      where: { email: normalised, source: "newsletter" },
      select: { id: true },
    });
    if (existing) return NextResponse.json({ ok: true, alreadySubscribed: true }, { status: 200 });

    await prisma.enquiry.create({
      data: {
        name: "Newsletter subscriber",
        email: normalised,
        // `phone` is non-null on the model and a subscriber has not given one.
        phone: "—",
        source: "newsletter",
        status: "NEW",
        message: "Signed up for new-design and offer alerts.",
        items: "[]",
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return serverError("subscribe.POST", err);
  }
}
