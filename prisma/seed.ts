import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FABRICS = ["Lycra", "Superpoly", "SAP Mattie", "TPU", "NS Lycra", "Elite Knit"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const SPORTS = [
  "Cricket", "Football", "Basketball", "Badminton",
  "Hockey", "Tennis", "Boxing", "Athletics",
];

// ---- Real product image pools per category style ----
// Keys match the style names used in CATEGORIES below.
const IMAGES: Record<string, string[]> = {
  // Collar T-Shirts
  "collar-fb": [
    "/uploads/FRONT___BACK_SUBLIMATION__CFB1.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB2.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB3.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB4.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB5.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB6.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB7.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB8.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB9.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB10.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB11.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB12.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB13.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB14.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB15.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__CFB16.jpeg",
  ],
  "collar-full": [
    "/uploads/FULL_SUBLIMATION__CFULL1.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL2.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL3.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL4.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL5.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL6.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL7.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL8.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL9.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL10.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL11.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL13.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL14.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL15.jpeg",
    "/uploads/FULL_SUBLIMATION__CFULL16.jpeg",
  ],
  "collar-sap": [
    "/uploads/SAP_MATTIE__AIR_FORCE_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__BLACK_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__MAROON_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__MINT_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__NAVY_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__OCEAN_BLUE_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__OLIVE_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__ONION_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__PEACH_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__RED_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__ROYAL_BLUE_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__SKY_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__T_BLUE_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__WHITE_SAP_MATTIE.jpeg",
    "/uploads/SAP_MATTIE__YELLOW_SAP_MATTIE.jpeg",
  ],

  // Round Neck T-Shirts
  "round-fb": [
    "/uploads/FRONT___BACK_SUBLIMATION__FB1.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB2.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB3.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB4.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB5.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB6.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB7.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB8.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB9.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB10.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB11.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB12.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB13.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB14.jpeg",
    "/uploads/FRONT___BACK_SUBLIMATION__FB15.jpeg",
  ],
  "round-full": [
    "/uploads/FULL_SUBLIMATION__FULL1.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL2.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL3.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL4.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL5.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL6.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL7.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL8.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL9.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL10.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL11.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL12.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL13.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL14.jpeg",
    "/uploads/FULL_SUBLIMATION__FULL15.jpeg",
  ],
  "round-front": [
    "/uploads/FRONT_SUBLIMATION__F1.jpeg",
    "/uploads/FRONT_SUBLIMATION__F2.jpeg",
    "/uploads/FRONT_SUBLIMATION__F3.jpeg",
    "/uploads/FRONT_SUBLIMATION__F4.jpeg",
    "/uploads/FRONT_SUBLIMATION__F5.jpeg",
    "/uploads/FRONT_SUBLIMATION__F6.jpeg",
    "/uploads/FRONT_SUBLIMATION__F7.jpeg",
    "/uploads/FRONT_SUBLIMATION__F8.jpeg",
    "/uploads/FRONT_SUBLIMATION__F9.jpeg",
    "/uploads/FRONT_SUBLIMATION__F10.jpeg",
    "/uploads/FRONT_SUBLIMATION__F11.jpeg",
    "/uploads/FRONT_SUBLIMATION__F12.jpeg",
    "/uploads/FRONT_SUBLIMATION__F13.jpeg",
    "/uploads/FRONT_SUBLIMATION__F14.jpeg",
    "/uploads/FRONT_SUBLIMATION__F15.jpeg",
  ],
  "round-plain": [
    "/uploads/PLAIN_T_SHIRTS__AIR_FORCE.jpeg",
    "/uploads/PLAIN_T_SHIRTS__BISLERI_GREEN.jpeg",
    "/uploads/PLAIN_T_SHIRTS__BLACK.jpeg",
    "/uploads/PLAIN_T_SHIRTS__DARK_GREY.jpeg",
    "/uploads/PLAIN_T_SHIRTS__LIGHT_GREY.jpeg",
    "/uploads/PLAIN_T_SHIRTS__NAVY.jpeg",
    "/uploads/PLAIN_T_SHIRTS__NEON_ORANGE.jpeg",
    "/uploads/PLAIN_T_SHIRTS__RED.jpeg",
    "/uploads/PLAIN_T_SHIRTS__ROYAL_BLUE.jpeg",
    "/uploads/PLAIN_T_SHIRTS__T_BLUE.jpeg",
    "/uploads/PLAIN_T_SHIRTS__WHITE.jpeg",
    "/uploads/PLAIN_T_SHIRTS__YELLOW.jpeg",
  ],

  // Shorts
  "shorts-elite": [
    "/uploads/ELITE__DOT_KNIT__PMC__HEAVY_KNIT__DIAGONAL_SHORTS__190_1.jpeg",
    "/uploads/ELITE__DOT_KNIT__PMC__HEAVY_KNIT__DIAGONAL_SHORTS__190_2.jpeg",
    "/uploads/ELITE__DOT_KNIT__PMC__HEAVY_KNIT__DIAGONAL_SHORTS__190_3.jpeg",
    "/uploads/ELITE__DOT_KNIT__PMC__HEAVY_KNIT__DIAGONAL_SHORTS__190_4.jpeg",
  ],
  "shorts-lycra": [
    "/uploads/LYCRA__KNITTED_LYCRA__SPANDEX__SHORTS__KL1.jpeg",
    "/uploads/LYCRA__KNITTED_LYCRA__SPANDEX__SHORTS__KL2.jpeg",
    "/uploads/LYCRA__KNITTED_LYCRA__SPANDEX__SHORTS__KL3.jpeg",
    "/uploads/LYCRA__KNITTED_LYCRA__SPANDEX__SHORTS__KL4.jpeg",
  ],
  "shorts-ns": [
    "/uploads/NS_LYCRA_SHORTS__NS1.jpeg",
    "/uploads/NS_LYCRA_SHORTS__NS2.jpeg",
    "/uploads/NS_LYCRA_SHORTS__NS3.jpeg",
    "/uploads/NS_LYCRA_SHORTS__NS4.jpeg",
  ],

  // Lowers
  "lowers-diagonal": [
    "/uploads/DIAGONAL__HEAVY_KNIT__ADIDAS_KNIT_LOWERS__L1.jpeg",
    "/uploads/DIAGONAL__HEAVY_KNIT__ADIDAS_KNIT_LOWERS__L2.jpeg",
    "/uploads/DIAGONAL__HEAVY_KNIT__ADIDAS_KNIT_LOWERS__L3.jpeg",
    "/uploads/DIAGONAL__HEAVY_KNIT__ADIDAS_KNIT_LOWERS__L4.jpeg",
    "/uploads/DIAGONAL__HEAVY_KNIT__ADIDAS_KNIT_LOWERS__L5.jpeg",
  ],
  "lowers-elite": [
    "/uploads/ELITE__HEAVY_PMC_LOWERS__EHPMC1.jpeg",
    "/uploads/ELITE__HEAVY_PMC_LOWERS__EHPMC2.jpeg",
    "/uploads/ELITE__HEAVY_PMC_LOWERS__EHPMC3.jpeg",
    "/uploads/ELITE__HEAVY_PMC_LOWERS__EHPMC4.jpeg",
    "/uploads/ELITE__HEAVY_PMC_LOWERS__EHPMC5.jpeg",
  ],
  "lowers-ns": [
    "/uploads/LYCRA__NS_LYCRA_LOWERS__LNS1.jpeg",
    "/uploads/LYCRA__NS_LYCRA_LOWERS__LNS2.jpeg",
    "/uploads/LYCRA__NS_LYCRA_LOWERS__LNS3.jpeg",
    "/uploads/LYCRA__NS_LYCRA_LOWERS__LNS4.jpeg",
    "/uploads/LYCRA__NS_LYCRA_LOWERS__LNS5.jpeg",
  ],

  // Tracksuits
  "tracksuit-lycra": [
    "/uploads/LYCRA_TRACKSUIT__LY1.jpeg",
    "/uploads/LYCRA_TRACKSUIT__LY2.jpeg",
    "/uploads/LYCRA_TRACKSUIT__LY3.jpeg",
    "/uploads/LYCRA_TRACKSUIT__LY4.jpeg",
    "/uploads/LYCRA_TRACKSUIT__LY5.jpeg",
  ],
  "tracksuit-ns": [
    "/uploads/NS_LYCRA_TRACKSUIT__NSL1.jpeg",
    "/uploads/NS_LYCRA_TRACKSUIT__NSL2.jpeg",
    "/uploads/NS_LYCRA_TRACKSUIT__NSL3.jpeg",
    "/uploads/NS_LYCRA_TRACKSUIT__NSL4.jpeg",
    "/uploads/NS_LYCRA_TRACKSUIT__NSL5.jpeg",
  ],
  "tracksuit-tpu": [
    "/uploads/TPU_TRACKSUIT__TPU1.jpeg",
    "/uploads/TPU_TRACKSUIT__TPU2.jpeg",
    "/uploads/TPU_TRACKSUIT__TPU3.jpeg",
    "/uploads/TPU_TRACKSUIT__TPU4.jpeg",
    "/uploads/TPU_TRACKSUIT__TPU5.jpeg",
  ],
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function pick<T>(arr: T[], n: number, offset = 0): T[] {
  const out: T[] = [];
  const count = Math.min(n, arr.length);
  for (let i = 0; i < count; i++) out.push(arr[(offset + i) % arr.length]);
  return out;
}

/** Return the image URL for product i (1-based) from the given pool, cycling. */
function pickImage(pool: string[], i: number): string {
  return pool[(i - 1) % pool.length];
}

type CatSpec = {
  name: string;
  slug: string;
  description: string;
  count: number;
  /** [styleName, imagePoolKey] pairs, cycled over products */
  styles: Array<{ label: string; imageKey: string }>;
  order: number;
  /** key for the category hero image */
  categoryImageKey: string;
};

const CATEGORIES: CatSpec[] = [
  {
    name: "Collar T-Shirts",
    slug: "collar-t-shirts",
    description:
      "Polo-style collar jerseys with vibrant sublimation. Available in front & back sublimation, full sublimation and SAP Mattie finishes.",
    count: 46,
    styles: [
      { label: "Front & Back Sublimation", imageKey: "collar-fb" },
      { label: "Full Sublimation",         imageKey: "collar-full" },
      { label: "SAP Mattie",               imageKey: "collar-sap" },
    ],
    order: 1,
    categoryImageKey: "collar-full",
  },
  {
    name: "Round Neck T-Shirts",
    slug: "round-neck-t-shirts",
    description:
      "Round-neck sports jerseys engineered for breathability and movement, with all-over sublimation printing.",
    count: 57,
    styles: [
      { label: "Front & Back Sublimation", imageKey: "round-fb" },
      { label: "Full Sublimation",         imageKey: "round-full" },
      { label: "Front Sublimation",        imageKey: "round-front" },
      { label: "Classic Fit",              imageKey: "round-plain" },
    ],
    order: 2,
    categoryImageKey: "round-full",
  },
  {
    name: "Shorts",
    slug: "shorts",
    description:
      "Lightweight performance shorts with moisture-wicking fabric and custom sublimated designs.",
    count: 12,
    styles: [
      { label: "Match Shorts",      imageKey: "shorts-elite" },
      { label: "Training Shorts",   imageKey: "shorts-lycra" },
      { label: "Basketball Shorts", imageKey: "shorts-ns" },
    ],
    order: 3,
    categoryImageKey: "shorts-elite",
  },
  {
    name: "Lowers",
    slug: "lowers",
    description:
      "Track lowers and joggers built for training and travel, tailored fit with side pockets.",
    count: 15,
    styles: [
      { label: "Slim Fit Lower", imageKey: "lowers-diagonal" },
      { label: "Regular Lower",  imageKey: "lowers-elite" },
      { label: "Jogger",         imageKey: "lowers-ns" },
    ],
    order: 4,
    categoryImageKey: "lowers-elite",
  },
  {
    name: "Tracksuits",
    slug: "tracksuits",
    description:
      "Complete tracksuit sets — jacket and lower — for teams, academies and institutions.",
    count: 15,
    styles: [
      { label: "Team Tracksuit",     imageKey: "tracksuit-lycra" },
      { label: "Presentation Set",   imageKey: "tracksuit-ns" },
      { label: "Winter Tracksuit",   imageKey: "tracksuit-tpu" },
    ],
    order: 5,
    categoryImageKey: "tracksuit-tpu",
  },
];

async function main() {
  console.log("🌱 Seeding ACCTIVE Sports database…");

  // ---- Admin user ----
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
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  let productTotal = 0;
  for (const cat of CATEGORIES) {
    // Use the first image of the category's hero image pool as the category image
    const categoryImage = IMAGES[cat.categoryImageKey]?.[0] ?? "/placeholder-product.svg";

    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        order: cat.order,
        image: categoryImage,
      },
    });

    const products = [];
    for (let i = 1; i <= cat.count; i++) {
      const styleSpec = cat.styles[(i - 1) % cat.styles.length];
      const design = String(i).padStart(3, "0");
      const name = `${cat.name.replace(/s$/, "")} — ${styleSpec.label} #${design}`;
      const sports = pick(SPORTS, 2 + (i % 3), i);

      const imagePool = IMAGES[styleSpec.imageKey] ?? ["/placeholder-product.svg"];
      const productImage = pickImage(imagePool, i);

      products.push({
        name,
        slug: slugify(`${cat.slug}-${styleSpec.label}-${design}`),
        description: `${styleSpec.label} ${cat.name.toLowerCase()} in premium fabric. Fully customizable with your team name, numbers, logo and colours. Ideal for ${sports.join(", ").toLowerCase()}.`,
        images: JSON.stringify([productImage]),
        fabrics: JSON.stringify(pick(FABRICS, 3 + (i % 3))),
        sizes: JSON.stringify(SIZES),
        sports: JSON.stringify(sports),
        moq: 1,
        featured: i <= 2,
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
