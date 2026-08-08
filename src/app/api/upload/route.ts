import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getSession } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;

// Only raster formats. SVG is deliberately excluded: it is an XML document that
// can carry <script>, and the local-disk backend serves uploads from the site's
// own origin — an uploaded SVG would execute as first-party JavaScript.
const ALLOWED: { ext: string; mime: string; match: (b: Buffer) => boolean }[] = [
  { ext: "jpg", mime: "image/jpeg", match: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    ext: "png",
    mime: "image/png",
    match: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    ext: "webp",
    mime: "image/webp",
    match: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP",
  },
  { ext: "gif", mime: "image/gif", match: (b) => b.subarray(0, 3).toString("ascii") === "GIF" },
];

// Admin image upload. Picks the first available storage backend:
//   1. Cloudinary        — set CLOUDINARY_URL   (recommended for Railway/Render)
//   2. Vercel Blob       — set BLOB_READ_WRITE_TOKEN
//   3. Local disk        — dev / a VPS with a persistent /public/uploads volume
// All return the same shape: { url }.
//
// Cloudinary folders:
//   "products"            — product images uploaded via the admin ProductForm
//   "website production" — general site assets (banners, logos, etc.)
// Pass an optional `folder` field in the FormData to select; defaults to "products".

const CLOUDINARY_FOLDERS = ["products", "website production"] as const;
type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[number];
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Even an authenticated admin shouldn't be able to fill the disk (or the
  // Cloudinary quota) by accident with a runaway client loop.
  const limit = rateLimit(`upload:${session.sub}`, 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many uploads. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  // Resolve target Cloudinary folder — only the two known folders are accepted.
  const rawFolder = typeof form.get("folder") === "string" ? (form.get("folder") as string).trim() : "";
  const cloudinaryFolder: CloudinaryFolder =
    (CLOUDINARY_FOLDERS as readonly string[]).includes(rawFolder)
      ? (rawFolder as CloudinaryFolder)
      : "products";

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  // Check size before reading the body into memory.
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Max 5MB" }, { status: 413 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  // Re-check after reading: `file.size` comes from the client's multipart
  // headers and can disagree with the actual payload.
  if (bytes.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "Max 5MB" }, { status: 413 });
  }

  // file.type is whatever the browser (or a hand-rolled request) claims. Decide
  // the real format from the file's magic bytes instead.
  const kind = ALLOWED.find((a) => a.match(bytes));
  if (!kind) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP or GIF images are allowed." },
      { status: 415 }
    );
  }

  const safe =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 40) || "image";
  // Math.random is not a suitable source for filenames an attacker may try to
  // guess; use the crypto RNG.
  const rand = randomBytes(6).toString("hex");
  const filename = `${safe}-${rand}.${kind.ext}`;

  // --- 1. Cloudinary (host-agnostic, recommended for Railway/Render) ---
  if (process.env.CLOUDINARY_URL) {
    try {
      const { v2: cloudinary } = await import("cloudinary");
      const dataUri = `data:${kind.mime};base64,${bytes.toString("base64")}`;
      const res = await cloudinary.uploader.upload(dataUri, {
        folder: cloudinaryFolder,
        public_id: `${safe}-${rand}`,
        resource_type: "image",
      });
      return NextResponse.json({ url: res.secure_url }, { status: 201 });
    } catch (err) {
      console.error("[upload] Cloudinary failed:", err);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  }

  // --- 2. Vercel Blob ---
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`${cloudinaryFolder}/${filename}`, bytes, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: kind.mime,
      });
      return NextResponse.json({ url: blob.url }, { status: 201 });
    } catch (err) {
      console.error("[upload] Vercel Blob failed:", err);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  }

  // --- 3. Local disk (dev / persistent-volume VPS) ---
  try {
    const { writeFile, mkdir } = await import("node:fs/promises");
    const path = await import("node:path");
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    // `filename` is rebuilt from a sanitised stem plus a fixed extension, so it
    // cannot contain path separators — but resolve and verify anyway.
    const target = path.join(dir, filename);
    if (!target.startsWith(dir + path.sep)) {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
    }
    await writeFile(target, bytes);
    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (err) {
    console.error("[upload] local write failed:", err);
    return NextResponse.json(
      {
        error:
          "Upload failed. On Railway/Render set CLOUDINARY_URL so images persist (their disks are ephemeral).",
      },
      { status: 500 }
    );
  }
}
