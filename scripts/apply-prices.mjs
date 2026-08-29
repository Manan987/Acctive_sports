/**
 * scripts/apply-prices.mjs
 *
 * Applies the official ACCTIVE Sports price list to every existing product in
 * the database, matched by category slug + material keyword in the product name.
 * Also sets MOQ = 5 for every product.
 *
 * Safe to re-run — uses updateMany, never deletes or creates products.
 * Works both on freshly seeded data (material-based names) and on the old
 * generic-label data (Match Shorts, Jogger, etc.).
 *
 * Usage:   npm run db:prices
 *
 * Official ACCTIVE Sports price list — August 2026
 * ─────────────────────────────────────────────────
 * A. ROUND NECK T-SHIRTS (MOQ 5 — Sizes S, M, L, XL, 2XL)
 *   Plain Selena (no sublimation)         ₹299
 *   Front Sublimation — F1 Series         ₹399
 *   Front & Back Sublimation — FB Series  ₹499
 *   Full Sublimation — FL Series          ₹599
 *
 * B. COLLAR T-SHIRTS (MOQ 5 — Sizes S, M, L, XL, 2XL)
 *   SAP Mattie — SAP Series               ₹499
 *   Front & Back Sublimation — FB Series  ₹699
 *   Full Sublimation — FL Series          ₹799
 *
 * C. SHORTS (MOQ 5 — Sizes S, M, L, XL, 2XL)
 *   NS Lycra Shorts                       ₹399
 *   Knitted Lycra (Spandex) Shorts        ₹499
 *   Zurich Shorts                         ₹399
 *   Sublimated Zurich Shorts              ₹599
 *   Cycling Shorts (NS Lycra + Tightee)   ₹699
 *   Superpoly Shorts                      ₹399
 *
 * D. LOWERS (MOQ 5 — Sizes S, M, L, XL, 2XL)
 *   NS Lycra Lower                        ₹499
 *   Knitted Lycra Lower                   ₹699
 *   Zurich Lower                          ₹499
 *   Sublimated Lower (Zurich & Diagonal)  ₹999
 *   Superpoly Lower                       ₹499
 *
 * E. TRACKSUITS (MOQ 5 — Sizes S, M, L, XL, 2XL)
 *   Plain Knitted Lycra Tracksuit         ₹1699
 *   Sublimated Knitted Lycra Tracksuit    ₹1799
 *   Plain NS Lycra Tracksuit              ₹1799
 *   Sublimated NS Lycra Tracksuit         ₹1899
 *   Plain Zurich Tracksuit                ₹1599
 *   Sublimated Zurich Tracksuit           ₹1699
 *   Plain Superpoly Tracksuit             ₹1199
 *   Sublimated Superpoly Tracksuit        ₹1299
 *
 * F. TRACK JACKETS — NS Lycra & Butter NS (MOQ 5 — Sizes S, M, L, XL, 2XL)
 *   Full Sublimation Jacket               ₹1999
 *   Cut & Sew Pattern Jacket              ₹1899
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Rules are tested in order; first match wins.
 *
 * nameContains  — substring matched against product.name (case-insensitive)
 *                 "" means "all remaining unpriced products in this category"
 * price         — MRP in INR (discounts applied at runtime by lib/pricing.ts)
 * moq           — minimum order quantity (5 for all ACCTIVE products)
 */
const PRICE_RULES = [

  // ── A. ROUND NECK T-SHIRTS ──────────────────────────────────────────────────
  // "Plain Selena" / "Classic Fit" label → ₹299
  { cat: "round-neck-t-shirts", match: "plain selena",             price: 299  },
  { cat: "round-neck-t-shirts", match: "classic fit",              price: 299  },
  // Front Sublimation (F1 Series) → ₹399
  // NOTE: "front sublimation" must come before "front & back" to avoid substring clash
  { cat: "round-neck-t-shirts", match: "front & back sublimation", price: 499  },
  { cat: "round-neck-t-shirts", match: "front sublimation",        price: 399  },
  // Full Sublimation (FL Series) → ₹599
  { cat: "round-neck-t-shirts", match: "full sublimation",         price: 599  },

  // ── B. COLLAR T-SHIRTS ──────────────────────────────────────────────────────
  { cat: "collar-t-shirts",     match: "sap mattie",               price: 499  },
  { cat: "collar-t-shirts",     match: "front & back sublimation", price: 699  },
  { cat: "collar-t-shirts",     match: "full sublimation",         price: 799  },

  // ── C. SHORTS ────────────────────────────────────────────────────────────────
  // Material-specific rules (new seed label names)
  { cat: "shorts",              match: "ns lycra shorts",          price: 399  },
  { cat: "shorts",              match: "knitted lycra shorts",     price: 499  },
  { cat: "shorts",              match: "sublimated zurich shorts", price: 599  },
  { cat: "shorts",              match: "zurich shorts",            price: 399  },  // plain Zurich — after sublimated
  { cat: "shorts",              match: "cycling shorts",           price: 699  },  // NS Lycra + Tightee
  { cat: "shorts",              match: "superpoly shorts",         price: 399  },
  // Old generic-label fallbacks (pre-reseed data)
  { cat: "shorts",              match: "basketball shorts",        price: 399  },  // was NS Lycra
  { cat: "shorts",              match: "training shorts",          price: 499  },  // was Knitted Lycra
  { cat: "shorts",              match: "match shorts",             price: 399  },  // was Zurich/Elite

  // ── D. LOWERS ──────────────────────────────────────────────────────────────
  // Material-specific rules (new seed label names)
  { cat: "lowers",              match: "ns lycra lower",           price: 499  },
  { cat: "lowers",              match: "knitted lycra lower",      price: 699  },
  { cat: "lowers",              match: "sublimated lower",         price: 999  },  // Zurich & Diagonal
  { cat: "lowers",              match: "zurich lower",             price: 499  },  // plain Zurich — after sublimated
  { cat: "lowers",              match: "superpoly lower",          price: 499  },
  // Old generic-label fallbacks
  { cat: "lowers",              match: "slim fit lower",           price: 499  },  // was Zurich/Diagonal
  { cat: "lowers",              match: "regular lower",            price: 699  },  // was Knitted Lycra
  { cat: "lowers",              match: "jogger",                   price: 499  },  // was NS Lycra

  // ── E. TRACKSUITS ──────────────────────────────────────────────────────────
  // Material + sublimation rules (new seed label names)
  { cat: "tracksuits",          match: "plain knitted lycra",      price: 1699 },
  { cat: "tracksuits",          match: "sublimated knitted lycra", price: 1799 },
  { cat: "tracksuits",          match: "plain ns lycra",           price: 1799 },
  { cat: "tracksuits",          match: "sublimated ns lycra",      price: 1899 },
  { cat: "tracksuits",          match: "plain zurich",             price: 1599 },
  { cat: "tracksuits",          match: "sublimated zurich",        price: 1699 },
  { cat: "tracksuits",          match: "plain superpoly",          price: 1199 },
  { cat: "tracksuits",          match: "sublimated superpoly",     price: 1299 },
  // Old generic-label fallbacks
  { cat: "tracksuits",          match: "team tracksuit",           price: 1699 },  // was Plain Knitted Lycra
  { cat: "tracksuits",          match: "presentation set",         price: 1799 },  // was Plain NS Lycra
  { cat: "tracksuits",          match: "winter tracksuit",         price: 1599 },  // was Plain Zurich
  // Catch-all for any remaining unpriced tracksuit
  { cat: "tracksuits",          match: "",                         price: 1699 },

  // ── F. TRACK JACKETS (NS Lycra & Butter NS) ────────────────────────────────
  { cat: "track-jackets",       match: "full sublimation jacket",  price: 1999 },
  { cat: "track-jackets",       match: "cut & sew jacket",         price: 1899 },
  { cat: "track-jackets",       match: "cut & sew pattern jacket", price: 1899 },
  // Old generic-label fallbacks
  { cat: "track-jackets",       match: "premium zipper",           price: 1899 },
  { cat: "track-jackets",       match: "front & back sublimation", price: 1899 },
  { cat: "track-jackets",       match: "full sublimation",         price: 1999 },
  // Catch-all for any remaining unpriced jacket
  { cat: "track-jackets",       match: "",                         price: 1999 },
];

const MOQ = 5;

async function main() {
  console.log("💰 ACCTIVE Sports — Applying official price list…\n");

  // Fetch all categories once
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true, name: true },
  });
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  let totalUpdated = 0;

  for (const rule of PRICE_RULES) {
    const cat = catBySlug[rule.cat];
    if (!cat) continue; // category not in DB yet — skip silently

    // For fallback rules (match: ""), only touch still-unpriced products so
    // specific rules applied earlier in this loop are not overwritten.
    const where = {
      categoryId: cat.id,
      ...(rule.match
        ? { name: { contains: rule.match } }
        : { price: null }),
    };

    const result = await prisma.product.updateMany({
      where,
      data: { price: rule.price, moq: MOQ },
    });

    if (result.count > 0) {
      const tag = rule.match ? `"${rule.match}"` : "(catch-all — unpriced)";
      console.log(`  ✓  [${cat.name}] ${tag} → ₹${rule.price} — ${result.count} product(s)`);
      totalUpdated += result.count;
    }
  }

  // Ensure MOQ = 5 on every product regardless of price rules
  const moqFix = await prisma.product.updateMany({
    where: { moq: { not: MOQ } },
    data: { moq: MOQ },
  });
  if (moqFix.count > 0) {
    console.log(`\n  ✓  MOQ normalised to ${MOQ} on ${moqFix.count} remaining product(s)`);
  }

  // Normalise sizes to S, M, L, XL, XXL on every product
  const CORRECT_SIZES = JSON.stringify(["S", "M", "L", "XL", "XXL"]);
  const sizesFix = await prisma.product.updateMany({
    where: { sizes: { not: CORRECT_SIZES } },
    data: { sizes: CORRECT_SIZES },
  });
  if (sizesFix.count > 0) {
    console.log(`  ✓  Sizes normalised to S/M/L/XL/XXL on ${sizesFix.count} product(s)`);
  }

  // Report anything still unpriced
  const unpriced = await prisma.product.count({ where: { price: null } });
  if (unpriced > 0) {
    const rows = await prisma.product.findMany({
      where: { price: null },
      include: { category: { select: { name: true } } },
      orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
    });
    console.warn(`\n  ⚠  ${unpriced} product(s) still have no price:`);
    rows.forEach((r) =>
      console.warn(`     — [${r.category.name}] ${r.name}`)
    );
    console.warn("     Add a matching rule above or set prices via the admin panel.\n");
  } else {
    console.log("\n  ✅  All products are priced.\n");
  }

  console.log(`✅  Done. ${totalUpdated} product(s) updated with correct prices and MOQ ${MOQ}.\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
