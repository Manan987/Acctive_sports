import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FABRICS = ["Lycra", "Superpoly", "SAP Mattie", "TPU", "NS Lycra", "Elite Knit"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const SPORTS = [
  "Cricket", "Football", "Basketball", "Badminton",
  "Hockey", "Tennis", "Boxing", "Athletics",
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

// Deterministic pick so re-seeding is stable. `offset` rotates the starting
// point: the previous version always took the first N entries, so every product
// in the catalogue ended up tagged with the same two or three sports and the
// "Shop by Sport" filters returned almost nothing for the rest.
function pick<T>(arr: T[], n: number, offset = 0): T[] {
  const out: T[] = [];
  const count = Math.min(n, arr.length);
  for (let i = 0; i < count; i++) out.push(arr[(offset + i) % arr.length]);
  return out;
}

type CatSpec = {
  name: string;
  slug: string;
  description: string;
  count: number;
  styles: string[];
  order: number;
};

const CATEGORIES: CatSpec[] = [
  {
    name: "Collar T-Shirts",
    slug: "collar-t-shirts",
    description:
      "Polo-style collar jerseys with vibrant sublimation. Available in front & back sublimation, full sublimation and SAP Mattie finishes.",
    count: 46,
    styles: ["Front & Back Sublimation", "Full Sublimation", "SAP Mattie"],
    order: 1,
  },
  {
    name: "Round Neck T-Shirts",
    slug: "round-neck-t-shirts",
    description:
      "Round-neck sports jerseys engineered for breathability and movement, with all-over sublimation printing.",
    count: 57,
    styles: ["Front & Back Sublimation", "Full Sublimation", "Classic Fit"],
    order: 2,
  },
  {
    name: "Shorts",
    slug: "shorts",
    description:
      "Lightweight performance shorts with moisture-wicking fabric and custom sublimated designs.",
    count: 12,
    styles: ["Match Shorts", "Training Shorts", "Basketball Shorts"],
    order: 3,
  },
  {
    name: "Lowers",
    slug: "lowers",
    description:
      "Track lowers and joggers built for training and travel, tailored fit with side pockets.",
    count: 15,
    styles: ["Slim Fit Lower", "Regular Lower", "Jogger"],
    order: 4,
  },
  {
    name: "Tracksuits",
    slug: "tracksuits",
    description:
      "Complete tracksuit sets — jacket and lower — for teams, academies and institutions.",
    count: 15,
    styles: ["Team Tracksuit", "Presentation Set", "Winter Tracksuit"],
    order: 5,
  },
];

async function main() {
  console.log("🌱 Seeding ACCTIVE Sports database…");

  // ---- Admin user ----
  // Normalised to lower case: the login route lower-cases the submitted email
  // before looking it up, so an ADMIN_EMAIL with any capitals would create an
  // account that could never be signed into.
  const email = (process.env.ADMIN_EMAIL || "admin@acctivesports.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "acctive@admin123";

  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_PASSWORD) {
    throw new Error(
      "[seed] ADMIN_PASSWORD must be set in production — refusing to create an " +
        "admin account with the publicly documented default password."
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "ACCTIVE Admin" },
  });
  console.log(`👤 Admin ready: ${email}`);

  // ---- Categories + products ----
  // Clear existing catalogue for a clean, repeatable seed
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  let productTotal = 0;
  for (const cat of CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        order: cat.order,
        image: "/placeholder-product.svg",
      },
    });

    const products = [];
    for (let i = 1; i <= cat.count; i++) {
      const style = cat.styles[(i - 1) % cat.styles.length];
      const design = String(i).padStart(3, "0");
      const name = `${cat.name.replace(/s$/, "")} — ${style} #${design}`;
      // `.sort(() => 0)` here was a no-op that read like a shuffle.
      const sports = pick(SPORTS, 2 + (i % 3), i);
      products.push({
        name,
        slug: slugify(`${cat.slug}-${style}-${design}`),
        description: `${style} ${cat.name.toLowerCase()} in premium fabric. Fully customizable with your team name, numbers, logo and colours. Ideal for ${sports.join(", ").toLowerCase()}.`,
        images: JSON.stringify(["/placeholder-product.svg"]),
        fabrics: JSON.stringify(pick(FABRICS, 3 + (i % 3))),
        sizes: JSON.stringify(SIZES),
        sports: JSON.stringify(sports),
        moq: 50,
        featured: i <= 2, // first two of each category featured
        published: true,
        categoryId: category.id,
      });
    }
    await prisma.product.createMany({ data: products });
    productTotal += products.length;
    console.log(`📦 ${cat.name}: ${products.length} products`);
  }

  console.log(`✅ Seeded ${CATEGORIES.length} categories, ${productTotal} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
