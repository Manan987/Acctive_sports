import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enquirySchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { serverError, readJson } from "@/lib/apiError";

export const dynamic = "force-dynamic";

// Public: submit a quote request or contact message
export async function POST(req: Request) {
  // Basic abuse protection: max 5 submissions/minute per IP
  const limit = rateLimit(`enquiry:${clientIp(req)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } }
    );
  }

  const body = await readJson(req);
  if (body === null) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Honeypot tripped → silently accept (don't tip off bots) but don't store
  if (data.website && data.website.trim() !== "") {
    console.warn("[enquiries] Honeypot tripped — discarding submission (website field was filled)");
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    // The cart lives in the browser's localStorage, so every field in it —
    // including price — is attacker-controlled. Re-read each product from the
    // catalogue and rebuild the line items from trusted data, keeping only the
    // customer's genuine choices (quantity, size, fabric, note). Without this
    // an order can be submitted claiming any product name at any price.
    const ids = Array.from(new Set(data.items.map((i) => i.productId)));
    const products = ids.length
      ? await prisma.product.findMany({
          where: { id: { in: ids }, published: true },
          select: { id: true, name: true, slug: true, price: true, moq: true },
        })
      : [];
    const byId = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    let hasPrice = false;
    const items = data.items.flatMap((i) => {
      const p = byId.get(i.productId);
      // Product deleted or unpublished since it was added to the cart — drop
      // the line rather than record an order for something unsellable.
      if (!p) return [];
      if (p.price != null) {
        hasPrice = true;
        total += p.price * i.qty;
      }
      return [
        {
          productId: p.id,
          name: p.name,
          slug: p.slug,
          qty: i.qty,
          size: i.size,
          fabric: i.fabric,
          note: i.note,
          price: p.price,
          moq: p.moq,
          lineTotal: p.price != null ? p.price * i.qty : null,
        },
      ];
    });

    // A cart order whose every line has since disappeared is not an order.
    if (data.source === "cart" && data.items.length > 0 && items.length === 0) {
      return NextResponse.json(
        { error: "The products in your cart are no longer available. Please review your cart." },
        { status: 409 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        message: data.message || null,
        source: data.source,
        // Previously accepted by the schema and then thrown away, so the admin
        // had no way to know how the customer intended to pay.
        paymentMethod: data.paymentMethod ?? null,
        total: hasPrice ? Math.round(total * 100) / 100 : null,
        items: JSON.stringify(items),
      },
    });

    // NOTE: To email yourself on each enquiry, plug an email provider (Resend,
    // Nodemailer, etc.) here. Kept dependency-free for easy first deploy.
    return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
  } catch (err) {
    return serverError("enquiries.POST", err);
  }
}

// Admin-only: list enquiries
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Unbounded findMany would eventually try to serialise every enquiry ever
    // received into a single response.
    const url = new URL(req.url);
    const take = Math.min(Math.max(Number(url.searchParams.get("take")) || 100, 1), 200);
    const skip = Math.max(Number(url.searchParams.get("skip")) || 0, 0);

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take, skip }),
      prisma.enquiry.count(),
    ]);
    return NextResponse.json({ enquiries, total, take, skip });
  } catch (err) {
    return serverError("enquiries.GET", err);
  }
}
