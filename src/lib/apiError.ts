import { NextResponse } from "next/server";

// Every route handler funnels unexpected failures through here. Without this a
// thrown Prisma error (unique-constraint violation, record-not-found, a dropped
// connection) escapes the handler and Next returns an opaque 500 — in dev it
// also leaks the query and connection string into the response.
export function serverError(scope: string, err: unknown) {
  console.error(`[${scope}]`, err);

  const code = (err as { code?: string } | null)?.code;
  switch (code) {
    case "P2002": // unique constraint failed
      return NextResponse.json(
        { error: "That value is already taken. Please use a different one." },
        { status: 409 }
      );
    case "P2003": // foreign key constraint failed
      return NextResponse.json(
        { error: "Referenced record does not exist." },
        { status: 422 }
      );
    case "P2025": // record not found
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    default:
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
  }
}

// Parse a JSON body without letting a malformed payload throw out of the handler.
export async function readJson(req: Request): Promise<unknown | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
