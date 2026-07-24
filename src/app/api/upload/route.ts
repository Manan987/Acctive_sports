import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

// Admin image upload. Picks the first available storage backend:
//   1. Cloudinary        — set CLOUDINARY_URL   (recommended for Railway/Render)
//   2. Vercel Blob       — set BLOB_READ_WRITE_TOKEN
//   3. Local disk        — dev / a VPS with a persistent /public/uploads volume
// All return the same shape: { url }.
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images allowed" }, { status: 415 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Max 5MB" }, { status: 413 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safe =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 40) || "image";
  const rand = Array.from({ length: 8 }, () =>
    "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");
  const filename = `${safe}-${rand}.${ext}`;

  // --- 1. Cloudinary (host-agnostic, recommended for Railway/Render) ---
  if (process.env.CLOUDINARY_URL) {
    try {
      const { v2: cloudinary } = await import("cloudinary");
      const bytes = Buffer.from(await file.arrayBuffer());
      const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;
      const res = await cloudinary.uploader.upload(dataUri, {
        folder: "acctive/products",
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
      const blob = await put(`products/${filename}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: file.type,
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
    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), bytes);
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
