import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { env } from "./env";

const COOKIE = "acctive_admin";
const secret = new TextEncoder().encode(env.authSecret);

export type AdminSession = { sub: string; email: string; name: string };

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function createSession(payload: AdminSession) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<AdminSession | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export function destroySession() {
  cookies().delete(COOKIE);
}

// ---- Customer session (OTP-based) ----

const CUSTOMER_COOKIE = "acctive_customer";

export type CustomerSession = {
  sub: string;      // customer.id
  phone: string;
  name: string;
  email?: string;
};

export async function createCustomerSession(payload: CustomerSession) {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  cookies().set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const token = cookies().get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as CustomerSession;
  } catch {
    return null;
  }
}

export function destroyCustomerSession() {
  cookies().delete(CUSTOMER_COOKIE);
}
