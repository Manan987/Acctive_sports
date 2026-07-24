import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enquirySchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";

// Public: submit a quote request or contact message
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
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
  const enquiry = await prisma.enquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      message: data.message || null,
      source: data.source,
      items: JSON.stringify(data.items),
    },
  });

  // NOTE: To email yourself on each enquiry, plug an email provider (Resend,
  // Nodemailer, etc.) here. Kept dependency-free for easy first deploy.
  return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
}

// Admin-only: list enquiries
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ enquiries });
}
