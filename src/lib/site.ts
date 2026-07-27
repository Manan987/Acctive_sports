// NEXT_PUBLIC_SITE_URL feeds metadataBase, canonical URLs, OG tags, the sitemap
// and robots.txt. If it is missing in production the whole site advertises
// itself as http://localhost:3000 — search engines index nothing and every
// social preview breaks — and the failure is completely silent. Warn loudly.
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[site] NEXT_PUBLIC_SITE_URL is not set — canonical URLs, OG images and " +
          "the sitemap will point at localhost. Set it to your public domain."
      );
    }
    return "http://localhost:3000";
  }
  // Tolerate a bare domain ("acctivesports.com") and a trailing slash.
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, "");
}

// Central place for brand + contact info. Edit here to update the whole site.
export const site = {
  name: "ACCTIVE Sports Industries",
  shortName: "ACCTIVE",
  tagline: "Premium Custom Sportswear, Manufactured in Meerut",
  description:
    "ACCTIVE Sports Industries manufactures premium sublimated sportswear — collar & round-neck jerseys, shorts, lowers and tracksuits — for teams, clubs, schools and brands across India. Vibrant sublimation, premium fabrics, custom designs and bulk orders with pan-India delivery.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "activesportswears@gmail.com",
  phones: ["+91 99971 00375", "+91 80062 77622"],
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919997100375",
  instagram: "https://instagram.com/acctivesports.76",
  instagramHandle: "@acctivesports.76",
  address: {
    line1: "41/31A Mokhampur, Plot No. 36",
    line2: "Sports Complex Enclave, Delhi Road",
    city: "Meerut",
    state: "Uttar Pradesh",
    pin: "250002",
    country: "India",
  },
  url: resolveSiteUrl(),
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
} as const;

export const fullAddress = `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.pin}, ${site.address.country}`;

export function whatsappLink(message?: string) {
  // wa.me only accepts bare digits — a number configured as "+91 99971 00375"
  // produces a dead link.
  const number = site.whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Fabrics offered by the factory (used across catalogue + product pages)
export const FABRICS = [
  "Lycra",
  "Superpoly",
  "SAP Mattie",
  "TPU",
  "NS Lycra",
  "Elite Knit",
] as const;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;

export const SPORTS = [
  "Cricket",
  "Football",
  "Basketball",
  "Badminton",
  "Hockey",
  "Tennis",
  "Boxing",
  "Athletics",
] as const;
