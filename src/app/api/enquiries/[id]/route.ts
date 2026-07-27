import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { serverError, readJson } from "@/lib/apiError";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "QUOTED", "CLOSED"]),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await readJson(req);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 422 });

  try {
    // Updating a deleted enquiry threw P2025 straight out of the handler.
    const enquiry = await prisma.enquiry.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ enquiry });
  } catch (err) {
    return serverError("enquiries.PATCH", err);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.enquiry.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if ((err as { code?: string })?.code === "P2025") {
      return NextResponse.json({ ok: true }); // already gone
    }
    return serverError("enquiries.DELETE", err);
  }
}
