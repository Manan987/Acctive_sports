import Image from "next/image";
import Link from "next/link";
import { SPORTS } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

const FALLBACK_IMAGE = "/placeholder-product.svg";

// Photography per sport. The tint is deliberately the same shape for every
// card — the previous version gave each sport its own hue (green, blue, orange,
// yellow, red, lime, rose, purple), which turned an eight-item row into a
// rainbow and pulled attention away from the product photography.
const SPORT_IMAGES: Record<string, string> = {
  Cricket:
    "https://res.cloudinary.com/rdhqircc/image/upload/v1786214184/8B29C08F-0DD3-4877-ADA0-6DF74AC068DE_jtm01y.png",
  Football:
    "https://res.cloudinary.com/rdhqircc/image/upload/v1786214182/843601A6-9423-4C65-8FF2-C9CAC94FF591_dzivxc.png",
  Basketball:
    "https://res.cloudinary.com/rdhqircc/image/upload/v1786214181/7A45002A-6DA5-4E67-982B-5E1D599B7AE6_psvmyl.png",
  Badminton:
    "https://res.cloudinary.com/rdhqircc/image/upload/v1786214192/D5BBD876-834C-4DAF-B452-975D03FBE336_rqjubv.png",
  Hockey:
    "https://res.cloudinary.com/rdhqircc/image/upload/v1786214174/1EA7C03E-1ABF-47D0-8B23-6AA51866F986_tsv6l5.png",
  Tennis:
    "https://res.cloudinary.com/rdhqircc/image/upload/v1786214174/1DE2D700-7A02-44CA-B8E5-0A76A2538A02_kepaxs.png",
  Boxing:
    "https://res.cloudinary.com/rdhqircc/image/upload/v1786214177/54079686-A53C-4C6B-B1D9-53C50A274AC0_pwrp4j.png",
  Athletics:
    "https://res.cloudinary.com/rdhqircc/image/upload/v1786214205/IMG_3778_uzqzpl.png",
};

export function ShopBySport() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {SPORTS.map((sport) => (
        <Link
          key={sport}
          href={`/catalogue?sport=${encodeURIComponent(sport)}`}
          className="group relative flex min-h-[180px] flex-col justify-end overflow-hidden rounded-2xl bg-ink-900 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-flame-500/15"
        >
          <Image
            // An unmapped sport used to pass src="" straight to next/image,
            // which throws and takes the whole section down.
            src={SPORT_IMAGES[sport] || FALLBACK_IMAGE}
            alt=""
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950 via-ink-950/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-flame-500 transition-transform duration-300 group-hover:scale-x-100" />

          <div className="relative flex items-center justify-between gap-1 px-3 pb-3">
            <span className="text-sm font-bold leading-tight drop-shadow">{sport}</span>
            <span className="shrink-0 -translate-x-1 text-flame-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              <Icon name="arrowRight" size={14} strokeWidth={2.5} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
