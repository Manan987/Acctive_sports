/**
 * normalise-moq.mjs
 * -----------------
 * One-off data fix: sets every product's minimum order quantity to 1.
 *
 * The catalogue was seeded with `moq: 50` back when the site sold bulk only.
 * The site now advertises "order from a single piece" in the announcement bar,
 * the FAQ, the hero and the pricing tiers — while product pages simultaneously
 * printed "Minimum order: 50 pieces" from this column. This aligns the data
 * with the promise.
 *
 * Run once after deploying:  node scripts/normalise-moq.mjs
 *
 * If a specific design genuinely cannot be produced below some quantity, set
 * that product's MOQ back to the real number in the admin panel afterwards —
 * the product page only prints a minimum when it exceeds 1.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const { count } = await prisma.product.updateMany({
    where: { moq: { not: 1 } },
    data: { moq: 1 },
  });
  console.log(`Updated ${count} product(s) -> moq: 1`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
