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

// Deterministic pick so re-seeding is stable
function pick<T>(arr: T[], n: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < arr.length && out.length < n; i++) out.push(arr[i]);
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
  const email = process.env.ADMIN_EMAIL || "admin@acctivesports.com";
  const password = process.env.ADMIN_PASSWORD || "acctive@admin123";
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
      const sports = pick(
        [...SPORTS].sort(),
        2 + (i % 3)
      ).sort(() => 0); // stable subset
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
