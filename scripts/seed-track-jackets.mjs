import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 12 unique track jacket images (duplicate removed)
const TRACK_JACKET_IMAGES = [
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219924/E974EE61-4506-4AAA-96E5-318AA9E141FD_bthnsi.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219924/E69E3F64-3855-419C-BBA9-69454F8CFA6B_uwhila.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219923/E1AF7969-8EFC-43D1-B9DE-11FEA06EF60D_tvukyw.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219923/da7477a3-eaae-480c-8d48-76a7b2e59140_ojealb.jpg",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219922/86336629-1115-46bf-a88f-1f8c328ad6f1_clxnsu.jpg",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219921/79700B22-7547-459F-9B53-1CAE1004A6B4_lphbsz.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219921/4076995F-167B-4742-9084-698C13F62335_ahinkw.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219920/34428b8e-da11-47f9-87b2-198620f62663_vmo9mx.jpg",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219920/3295EC69-2D8B-4432-A48A-C94B9D453705_bq6zgg.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219919/2966C258-C47B-49BD-BF9F-14227F13AEF6_ircuvz.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219918/26CC16B1-6D70-459B-AE7D-2CED40F90526_ttfkzz.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786219918/295dc44e-c74d-465e-b03b-28c3edf18fe4_s5nstz.jpg",
];

const STYLES = [
  "Full Sublimation",
  "Front & Back Sublimation",
  "Premium Zipper",
  "Full Sublimation",
  "Front & Back Sublimation",
  "Premium Zipper",
  "Full Sublimation",
  "Front & Back Sublimation",
  "Premium Zipper",
  "Full Sublimation",
  "Front & Back Sublimation",
  "Premium Zipper",
];

const SPORTS = ["Cricket", "Football", "Basketball", "Athletics", "Hockey", "Tennis"];
const FABRICS = ["Lycra", "Superpoly", "SAP Mattie", "NS Lycra"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

async function main() {
  // Get the track-jackets category
  const cat = await prisma.category.findUnique({ where: { slug: "track-jackets" } });
  if (!cat) {
    console.error("❌ Track Jackets category not found. Run create-track-jackets.mjs first.");
    return;
  }

  // Set category image to first track jacket photo
  await prisma.category.update({
    where: { slug: "track-jackets" },
    data: { image: TRACK_JACKET_IMAGES[0] },
  });
  console.log("🖼️  Category hero image set.");

  // Check for already existing products in this category
  const existing = await prisma.product.count({ where: { categoryId: cat.id } });
  if (existing > 0) {
    console.log(`ℹ️  ${existing} products already exist in Track Jackets. Skipping product creation.`);
    console.log("   Delete them from the admin panel first if you want to re-seed.");
    return;
  }

  const products = TRACK_JACKET_IMAGES.map((imgUrl, i) => {
    const num = String(i + 1).padStart(3, "0");
    const style = STYLES[i % STYLES.length];
    const sports = [SPORTS[i % SPORTS.length], SPORTS[(i + 2) % SPORTS.length]];
    const fabrics = [FABRICS[i % FABRICS.length], FABRICS[(i + 1) % FABRICS.length]];

    return {
      name: `Track Jacket — ${style} #${num}`,
      slug: slugify(`track-jacket-${style}-${num}`),
      description: `Premium ${style.toLowerCase()} track jacket with moisture-wicking fabric. Fully customizable with your team name, numbers, logo and colours. Available in all sizes. Ideal for ${sports.join(" & ").toLowerCase()}.`,
      images: JSON.stringify([imgUrl]),
      fabrics: JSON.stringify(fabrics),
      sizes: JSON.stringify(SIZES),
      sports: JSON.stringify(sports),
      moq: 1,
      featured: i < 2,   // first 2 are featured
      published: true,
      categoryId: cat.id,
    };
  });

  await prisma.product.createMany({ data: products });
  console.log(`✅ Created ${products.length} Track Jacket products.`);

  // Log a summary
  products.forEach((p, i) => {
    console.log(`  ${String(i + 1).padStart(2, " ")}. ${p.name}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
