import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const categories = await p.category.findMany({ select: { name: true, slug: true, _count: { select: { products: true } } }, orderBy: { order: "asc" } });
const totalProducts = await p.product.count();
const adminUsers = await p.adminUser.count();
const enquiries = await p.enquiry.count();
const priced = await p.product.count({ where: { price: { not: null } } });
const unpriced = await p.product.count({ where: { price: null } });

const samples = await p.product.findMany({
  select: { name: true, price: true, moq: true, sizes: true, category: { select: { name: true } } },
  orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
});

console.log("═══════════════════════════════════════════════════");
console.log("  ACCTIVE Sports — PostgreSQL Database Report");
console.log("═══════════════════════════════════════════════════\n");

console.log("📊 TABLE ROW COUNTS");
console.log("───────────────────");
console.log(`  Categories  : ${categories.length}`);
console.log(`  Products    : ${totalProducts}  (${priced} priced, ${unpriced} unpriced)`);
console.log(`  Admin Users : ${adminUsers}`);
console.log(`  Enquiries   : ${enquiries}`);

console.log("\n📦 CATEGORIES & PRODUCT COUNTS");
console.log("───────────────────────────────");
for (const c of categories) {
  console.log(`  ${c.name.padEnd(22)} ${String(c._count.products).padStart(3)} products   (slug: ${c.slug})`);
}

console.log("\n💰 PRICES BY CATEGORY");
console.log("─────────────────────");
let lastCat = "";
for (const s of samples) {
  if (s.category.name !== lastCat) {
    lastCat = s.category.name;
    console.log(`\n  [${lastCat}]`);
  }
  const sizes = JSON.parse(s.sizes);
  console.log(`    ${s.name.padEnd(55)} ₹${String(s.price).padStart(4)}  MOQ:${s.moq}  Sizes: ${sizes.join(",")}`);
}

const priceRange = await p.product.aggregate({ _min: { price: true }, _max: { price: true } });
console.log(`\n\n📈 PRICE RANGE: ₹${priceRange._min.price} — ₹${priceRange._max.price}`);

const wrongSizes = await p.product.count({ where: { sizes: { not: JSON.stringify(["S","M","L","XL","XXL"]) } } });
console.log(`✅ SIZES:  ${wrongSizes === 0 ? "All products → S/M/L/XL/XXL ✓" : `⚠ ${wrongSizes} wrong`}`);

const wrongMoq = await p.product.count({ where: { moq: { not: 5 } } });
console.log(`✅ MOQ:    ${wrongMoq === 0 ? "All products → MOQ 5 ✓" : `⚠ ${wrongMoq} wrong`}`);
console.log(`✅ PRICES: ${unpriced === 0 ? "All products priced ✓" : `⚠ ${unpriced} unpriced`}`);

console.log(`\n═══════════════════════════════════════════════════\n`);
await p.$disconnect();
