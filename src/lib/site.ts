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
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
} as const;

export const fullAddress = `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.pin}, ${site.address.country}`;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
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
