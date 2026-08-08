import Image from "next/image";

const PARTNERS = [
  "Cricket Academies",
  "Football Clubs",
  "School Teams",
  "Corporate Leagues",
  "Retail Brands",
  "Gym Chains",
  "University Sports",
  "State Associations",
];

// Product images cycle between the marquee entries for visual richness
const PRODUCT_IMGS = [
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png",
];

export function PartnersMarquee() {
  const row = [...PARTNERS, ...PARTNERS];
  return (
    <div className="relative overflow-hidden py-3">
      <div className="marquee-track gap-8">
        {row.map((p, i) => (
          <span
            key={i}
            className="inline-flex shrink-0 items-center gap-3"
          >
            {/* Tiny product thumbnail every 3rd item */}
            {i % 3 === 0 && (
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full border border-flame-500/30">
                <Image
                  src={PRODUCT_IMGS[(i / 3) % PRODUCT_IMGS.length]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </span>
            )}
            <span className="whitespace-nowrap font-display text-base font-bold text-ink-300 dark:text-ink-600">
              {p}
            </span>
            <span className="mx-2 text-flame-500">✦</span>
          </span>
        ))}
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent dark:from-ink-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent dark:from-ink-950" />
    </div>
  );
}
