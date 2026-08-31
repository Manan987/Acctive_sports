import { NextResponse } from "next/server";
import { getCustomerSession, destroyCustomerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/customer/session — return current customer session (or 401)
 * DELETE /api/customer/session — log out (clear cookie)
 */

export async function GET() {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ customer: null }, { status: 401 });
  }
  return NextResponse.json({
    customer: {
      id: session.sub,
      name: session.name,
      phone: session.phone,
      email: session.email ?? null,
    },
  });
}

export async function DELETE() {
  destroyCustomerSession();
  return NextResponse.json({ ok: true });
}
