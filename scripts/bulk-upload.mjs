/**
 * bulk-upload.mjs
 * ---------------
 * Reads every image in CATALOUGE/, uploads it to Cloudinary,
 * then updates the matching product in the SQLite database.
 *
 * Run:  node scripts/bulk-upload.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Load .env ─────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) throw new Error(".env not found");
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#\n]*)"?/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

if (!process.env.CLOUDINARY_URL) {
  console.error("CLOUDINARY_URL not set in .env");
  process.exit(1);
}

// ── Dynamic imports (ESM) ─────────────────────────────────────────────────────
const { v2: cloudinary } = await import("cloudinary");
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

// ── Folder to DB category slug map ────────────────────────────────────────────
const FOLDER_TO_SLUG = {
  "COLLAR TSHIRTS":     "collar-t-shirts",
  "ROUND NECK TSHIRTS": "round-neck-t-shirts",
  "SHORTS":             "shorts",
  "LOWERS":             "lowers",
  "TRACKSUITS":         "tracksuits",
};

// ── Recursively collect all image files ───────────────────────────────────────
function collectImages(dir, images = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectImages(full, images);
    } else if (/\.(jpe?g|png|webp|gif)$/i.test(entry)) {
      images.push(full);
    }
  }
  return images;
}

// ── Map image path to category slug ───────────────────────────────────────────
function getCategorySlug(imagePath) {
  const catalogueRoot = join(ROOT, "CATALOUGE");
  const rel = imagePath.substring(catalogueRoot.length + 1);
  const topFolder = rel.split(/[\\/]/)[0];
  return FOLDER_TO_SLUG[topFolder] || null;
}

// ── Upload one image to Cloudinary ────────────────────────────────────────────
async function uploadToCloudinary(filePath) {
  const name = basename(filePath, extname(filePath))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const bytes = readFileSync(filePath);
  const mimeType = /\.png$/i.test(filePath) ? "image/png" : "image/jpeg";
  const dataUri = `data:${mimeType};base64,${bytes.toString("base64")}`;
  const res = await cloudinary.uploader.upload(dataUri, {
    folder: "acctive/products",
    public_id: `cat-${name}-${Date.now()}`,
    resource_type: "image",
    overwrite: false,
  });
  return res.secure_url;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const catalogueDir = join(ROOT, "CATALOUGE");
  if (!existsSync(catalogueDir)) {
    console.error("CATALOUGE folder not found at", catalogueDir);
    process.exit(1);
  }

  const allImages = collectImages(catalogueDir);
  console.log(`\n Found ${allImages.length} images in CATALOUGE/\n`);

  // Group images by category slug
  const byCategory = {};
  for (const imgPath of allImages) {
    const slug = getCategorySlug(imgPath);
    if (!slug) {
      console.warn("  Skipping (unknown category):", basename(imgPath));
      continue;
    }
    (byCategory[slug] = byCategory[slug] || []).push(imgPath);
  }

  // Fetch categories and products from DB
  const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, categoryId: true, images: true },
  });

  const productsByCategory = {};
  for (const p of products) {
    const slug = categories.find((c) => c.id === p.categoryId)?.slug;
    if (!slug) continue;
    (productsByCategory[slug] = productsByCategory[slug] || []).push(p);
  }

  let uploaded = 0;
  let updated = 0;
  let errors = 0;

  for (const [slug, imagePaths] of Object.entries(byCategory)) {
    const catProducts = productsByCategory[slug] || [];
    console.log(`\n ${slug}: ${imagePaths.length} images -> ${catProducts.length} products`);

    for (let i = 0; i < imagePaths.length; i++) {
      const imgPath = imagePaths[i];
      const imgName = basename(imgPath);

      try {
        process.stdout.write(`   Uploading ${imgName}...`);
        const url = await uploadToCloudinary(imgPath);
        uploaded++;
        process.stdout.write(` done\n`);

        // Assign image to matching product (round-robin if more images than products)
        const product = catProducts[i % catProducts.length];
        if (product) {
          const existing = JSON.parse(product.images || "[]");
          const cleaned = existing.filter((u) => !u.includes("placeholder"));
          if (!cleaned.includes(url)) {
            const newImages = JSON.stringify([...cleaned, url]);
            await prisma.product.update({
              where: { id: product.id },
              data: { images: newImages },
            });
            product.images = newImages; // keep in-memory in sync
            updated++;
          }
        }
      } catch (err) {
        errors++;
        console.error(`\n   FAILED ${imgName}:`, err.message);
      }
    }
  }

  console.log(`\n Done!`);
  console.log(`   Uploaded: ${uploaded} images to Cloudinary`);
  console.log(`   DB products updated: ${updated}`);
  if (errors) console.log(`   Errors: ${errors}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
