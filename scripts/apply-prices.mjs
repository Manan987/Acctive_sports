/**
 * scripts/apply-prices.mjs
 *
 * Applies the official ACCTIVE Sports price list to every existing product in
 * the database, matched by category slug + style keyword in the product name.
 * Also sets MOQ = 5 for every product.
 * Creates the Jackets category if it does not yet exist.
 *
 * Safe to re-run: uses updateMany with explicit where clauses — it never
 * deletes or creates products (except creating the Jackets category stub).
 *
 * Usage:
 *   npm run db:prices
 *   — or —
 *   node scripts/apply-prices.mjs
 *
 * Run AFTER npm run db:provider so the correct Prisma datasource is selected.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Price rules — order matters: more specific rules must come before broader ones.
 *
 * Each rule:
 *   categorySlug  – matched against category.slug (exact)
 *   nameContains  – substring checked against product.name (case-insensitive)
 *                   Empty string "" matches ALL products in that category.
 *   price         – MRP in INR. Discounts (25% / 50%) are applied at runtime
 *                   by src/lib/pricing.ts — never hard-code a discounted price.
 *   moq           – minimum order quantity
 *
 * Official ACCTIVE Sports price list — August 2026
 * ─────────────────────────────────────────────────
 * A. ROUND NECK T-SHIRTS                           MOQ 5
 *   Plain / Selena                           ₹299
 *   Front Sublimation (F1 Series)            ₹399
 *   Front & Back Sublimation (FB Series)     ₹499
 *   Full Sublimation (FL Series)             ₹599
 *
 * B. COLLAR T-SHIRTS                               MOQ 5
 *   SAP Mattie (SAP Series)                  ₹499
 *   Front & Back Sublimation (FB Series)     ₹699
 *   Full Sublimation (FL Series)             ₹799
 *
 * C. SHORTS                                        MOQ 5
 *   NS Lycra Shorts                          ₹399
 *   Knitted Lycra (Spandex) Shorts           ₹499
 *   Zurich / Elite (Match) Shorts            ₹399
 *   Sublimated Zurich Shorts                 ₹599
 *   Athlete & Cycling (NS Lycra+Tightee)     ₹699
 *   Superpoly Shorts                         ₹399
 *
 * D. LOWERS                                        MOQ 5
 *   NS Lycra Lower                           ₹499
 *   Knitted Lycra Lower                      ₹699
 *   Zurich / Slim Fit Lower                  ₹499
 *   Sublimated Lower (Zurich / Diagonal)     ₹999
 *   Superpoly Lower                          ₹499
 *
 * E. TRACKSUITS                                    MOQ 5
 *   Plain Knitted Lycra (Team)               ₹1699
 *   Sublimated Knitted Lycra                 ₹1799
 *   Plain NS Lycra (Presentation)            ₹1799
 *   Sublimated NS Lycra                      ₹1899
 *   Plain Zurich (Winter)                    ₹1599
 *   Sublimated Zurich                        ₹1699
 *   Plain Superpoly                          ₹1199
 *   Sublimated Superpoly                     ₹1299
 *
 * F. JACKETS (NS Lycra & Butter NS)               MOQ 5
 *   Full Sublimation Jacket                  ₹1999
 *   Cut & Sew Pattern Jacket                 ₹1899
 */
const PRICE_RULES = [
  // ─── A. ROUND NECK T-SHIRTS ─────────────────────────────────────────────
  { categorySlug: "round-neck-t-shirts", nameContains: "classic fit",              price: 299,  moq: 5 },
  { categorySlug: "round-neck-t-shirts", nameContains: "front sublimation",        price: 399,  moq: 5 },
  { categorySlug: "round-neck-t-shirts", nameContains: "front & back sublimation", price: 499,  moq: 5 },
  { categorySlug: "round-neck-t-shirts", nameContains: "full sublimation",         price: 599,  moq: 5 },

  // ─── B. COLLAR T-SHIRTS ──────────────────────────────────────────────────
  { categorySlug: "collar-t-shirts",     nameContains: "sap mattie",               price: 499,  moq: 5 },
  { categorySlug: "collar-t-shirts",     nameContains: "front & back sublimation", price: 699,  moq: 5 },
  { categorySlug: "collar-t-shirts",     nameContains: "full sublimation",         price: 799,  moq: 5 },

  // ─── C. SHORTS ────────────────────────────────────────────────────────────
  // Seed style labels: "Match Shorts", "Training Shorts", "Basketball Shorts"
  // Match Shorts → Zurich/Elite base → ₹399
  { categorySlug: "shorts",              nameContains: "match shorts",             price: 399,  moq: 5 },
  // Training Shorts → Knitted Lycra/Spandex → ₹499
  { categorySlug: "shorts",              nameContains: "training shorts",          price: 499,  moq: 5 },
  // Basketball Shorts → NS Lycra → ₹399
  { categorySlug: "shorts",              nameContains: "basketball shorts",        price: 399,  moq: 5 },

  // ─── D. LOWERS ────────────────────────────────────────────────────────────
  // Seed style labels: "Slim Fit Lower", "Regular Lower", "Jogger"
  // Slim Fit Lower → Zurich/Diagonal → ₹499
  { categorySlug: "lowers",              nameContains: "slim fit lower",           price: 499,  moq: 5 },
  // Regular Lower → Knitted Lycra → ₹699
  { categorySlug: "lowers",              nameContains: "regular lower",            price: 699,  moq: 5 },
  // Jogger → NS Lycra → ₹499
  { categorySlug: "lowers",              nameContains: "jogger",                   price: 499,  moq: 5 },

  // ─── E. TRACKSUITS ────────────────────────────────────────────────────────
  // Seed style labels: "Team Tracksuit", "Presentation Set", "Winter Tracksuit"
  // Team Tracksuit → Plain Knitted Lycra → ₹1699
  { categorySlug: "tracksuits",          nameContains: "team tracksuit",           price: 1699, moq: 5 },
  // Presentation Set → Plain NS Lycra → ₹1799
  { categorySlug: "tracksuits",          nameContains: "presentation set",         price: 1799, moq: 5 },
  // Winter Tracksuit → Plain Zurich → ₹1599
  { categorySlug: "tracksuits",          nameContains: "winter tracksuit",         price: 1599, moq: 5 },
  // Fallback: any remaining tracksuit → ₹1699 (plain knitted lycra base)
  { categorySlug: "tracksuits",          nameContains: "",                         price: 1699, moq: 5 },

  // ─── F. JACKETS (NS Lycra & Butter NS) ─────────────────────────────────
  // Seed slug is "track-jackets". Style labels: "Full Sublimation", "Front & Back Sublimation", "Premium Zipper"
  // 1. Full Sublimation Jacket → ₹1999
  { categorySlug: "track-jackets",        nameContains: "full sublimation",         price: 1999, moq: 5 },
  // 2. Cut & Sew / Premium Zipper → ₹1899
  { categorySlug: "track-jackets",        nameContains: "premium zipper",           price: 1899, moq: 5 },
  // 3. Front & Back Sublimation → price between FL and plain; use ₹1899
  { categorySlug: "track-jackets",        nameContains: "front & back sublimation", price: 1899, moq: 5 },
  // Fallback for any remaining jacket
  { categorySlug: "track-jackets",        nameContains: "",                         price: 1999, moq: 5 },
  // Also cover a plain "jackets" slug in case the category is created fresh
  { categorySlug: "jackets",              nameContains: "cut",                      price: 1899, moq: 5 },
  { categorySlug: "jackets",              nameContains: "",                         price: 1999, moq: 5 },
];

async function main() {
  console.log("💰 Applying ACCTIVE Sports official price list…\n");

  // Fetch all categories once so we can resolve slug → id
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true, name: true },
  });
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  // Ensure the Jackets category exists (new product line)
  if (!catBySlug["jackets"]) {
    const jacket = await prisma.category.create({
      data: {
        name: "Jackets",
        slug: "jackets",
        description:
          "Custom sublimated and cut & sew jackets in NS Lycra and Butter NS fabric — for teams, academies and institutions.",
        order: 6,
      },
    });
    catBySlug["jackets"] = jacket;
    console.log("  🆕  Created 'Jackets' category\n");
  }

  const applied = new Set(); // track categoryId+nameContains pairs already applied
  let totalUpdated = 0;

  for (const rule of PRICE_RULES) {
    const cat = catBySlug[rule.categorySlug];
    if (!cat) {
      console.warn(`  ⚠  Category not found: ${rule.categorySlug} — skipping`);
      continue;
    }

    // Avoid applying a broad fallback ("") to products already matched by
    // a more specific rule in this same run (updateMany doesn't skip already-priced).
    // We use a where clause to only update products that are STILL unpriced
    // when the fallback fires.
    const pairKey = `${cat.id}::${rule.nameContains}`;
    if (applied.has(pairKey)) continue;
    applied.add(pairKey);

    const where = {
      categoryId: cat.id,
      ...(rule.nameContains
        ? { name: { contains: rule.nameContains } }
        : { price: null }), // fallback: only touch still-unpriced products
    };

    const result = await prisma.product.updateMany({
      where,
      data: { price: rule.price, moq: rule.moq },
    });

    if (result.count > 0) {
      const tag = rule.nameContains ? `"${rule.nameContains}"` : "(fallback — unpriced)";
      console.log(
        `  ✓  [${cat.name}] ${tag} → ₹${rule.price} — ${result.count} product(s)`
      );
      totalUpdated += result.count;
    }
  }

  // Set MOQ = 5 on any product whose moq is still not 5
  const moqFix = await prisma.product.updateMany({
    where: { moq: { not: 5 } },
    data: { moq: 5 },
  });
  if (moqFix.count > 0) {
    console.log(`\n  ✓  MOQ normalised to 5 on ${moqFix.count} remaining product(s)`);
  }

  // Report any still-unpriced products
  const unpriced = await prisma.product.count({ where: { price: null } });
  if (unpriced > 0) {
    const unpricedRows = await prisma.product.findMany({
      where: { price: null },
      include: { category: { select: { name: true } } },
      orderBy: { name: "asc" },
    });
    console.warn(`\n  ⚠  ${unpriced} product(s) still have no price:`);
    unpricedRows.forEach((r) =>
      console.warn(`     — [${r.category.name}] ${r.name}`)
    );
    console.warn("     Add a matching rule above or set prices in the admin panel.\n");
  } else {
    console.log("\n  ✅  All products are priced.");
  }

  console.log(`\n✅ Done. ${totalUpdated} product(s) updated.\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
