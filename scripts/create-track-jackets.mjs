import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.category.findUnique({ where: { slug: "track-jackets" } });
  if (existing) {
    console.log("Already exists:", JSON.stringify(existing, null, 2));
    return;
  }
  const cat = await prisma.category.create({
    data: {
      name: "Track Jackets",
      slug: "track-jackets",
      description:
        "Premium sublimated track jackets — custom logos, names and colours for teams and clubs.",
      order: 6,
    },
  });
  console.log("Created:", JSON.stringify(cat, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
