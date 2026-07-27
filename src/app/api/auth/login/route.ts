import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { rateLimit, resetLimit, clientIp } from "@/lib/rateLimit";
import { serverError, readJson } from "@/lib/apiError";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  // The admin login was completely unthrottled: a script could try passwords
  // as fast as bcrypt would answer, forever. Limit by IP and by account so
  // neither a single source nor a distributed sweep at one account is free.
  const ipKey = `login:ip:${clientIp(req)}`;
  const ipLimit = rateLimit(ipKey, 10, 15 * 60_000);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter ?? 900) } }
    );
  }

  const body = await readJson(req);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const { password } = parsed.data;

  const accountKey = `login:acct:${email}`;
  const acctLimit = rateLimit(accountKey, 10, 15 * 60_000);
  if (!acctLimit.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(acctLimit.retryAfter ?? 900) } }
    );
  }

  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Successful sign-in clears the counters so an admin who fat-fingered
    // their password a few times isn't locked out afterwards.
    resetLimit(ipKey);
    resetLimit(accountKey);

    await createSession({ sub: user.id, email: user.email, name: user.name });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError("auth.login", err);
  }
}
