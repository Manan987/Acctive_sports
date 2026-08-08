import Image from "next/image";
import Link from "next/link";
import { SPORTS } from "@/lib/site";

const SPORT_DATA: Record<
  string,
  { emoji: string; accentColor: string; imgSrc: string }
> = {
  Cricket: {
    emoji: "🏏",
    accentColor: "from-green-800/60 to-green-950/80",
    imgSrc:
      "https://res.cloudinary.com/rdhqircc/image/upload/v1786214184/8B29C08F-0DD3-4877-ADA0-6DF74AC068DE_jtm01y.png",
  },
  Football: {
    emoji: "⚽",
    accentColor: "from-blue-800/60 to-blue-950/80",
    imgSrc:
      "https://res.cloudinary.com/rdhqircc/image/upload/v1786214182/843601A6-9423-4C65-8FF2-C9CAC94FF591_dzivxc.png",
  },
  Basketball: {
    emoji: "🏀",
    accentColor: "from-orange-800/60 to-orange-950/80",
    imgSrc:
      "https://res.cloudinary.com/rdhqircc/image/upload/v1786214181/7A45002A-6DA5-4E67-982B-5E1D599B7AE6_psvmyl.png",
  },
  Badminton: {
    emoji: "🏸",
    accentColor: "from-yellow-800/60 to-yellow-950/80",
    imgSrc:
      "https://res.cloudinary.com/rdhqircc/image/upload/v1786214192/D5BBD876-834C-4DAF-B452-975D03FBE336_rqjubv.png",
  },
  Hockey: {
    emoji: "🏑",
    accentColor: "from-red-800/60 to-red-950/80",
    imgSrc:
      "https://res.cloudinary.com/rdhqircc/image/upload/v1786214174/1EA7C03E-1ABF-47D0-8B23-6AA51866F986_tsv6l5.png",
  },
  Tennis: {
    emoji: "🎾",
    accentColor: "from-lime-800/60 to-lime-950/80",
    imgSrc:
      "https://res.cloudinary.com/rdhqircc/image/upload/v1786214174/1DE2D700-7A02-44CA-B8E5-0A76A2538A02_kepaxs.png",
  },
  Boxing: {
    emoji: "🥊",
    accentColor: "from-rose-800/60 to-rose-950/80",
    imgSrc:
      "https://res.cloudinary.com/rdhqircc/image/upload/v1786214177/54079686-A53C-4C6B-B1D9-53C50A274AC0_pwrp4j.png",
  },
  Athletics: {
    emoji: "🏃",
    accentColor: "from-purple-800/60 to-purple-950/80",
    imgSrc:
      "https://res.cloudinary.com/rdhqircc/image/upload/v1786214205/IMG_3778_uzqzpl.png",
  },
};

export function ShopBySport() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      {SPORTS.map((sport) => {
        const data = SPORT_DATA[sport] ?? {
          emoji: "🏅",
          accentColor: "from-ink-800/60 to-ink-950/80",
          imgSrc: "",
        };

        return (
          <Link
            key={sport}
            href={`/catalogue?sport=${encodeURIComponent(sport)}`}
            className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl bg-ink-900 text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-flame-500/25"
            style={{ minHeight: "180px" }}
          >
            {/* Sport-specific image — clearly visible */}
            <Image
              src={data.imgSrc}
              alt={sport}
              fill
              className="object-cover object-center transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
            />

            {/* Bottom gradient so label is readable — NOT covering full image */}
            <div
              className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t ${data.accentColor}`}
            />

            {/* Hover flame accent bar */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-flame-500 to-electric-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Label area */}
            <div className="relative flex flex-col items-center gap-1 px-2 pb-3 pt-2">
              <span className="text-2xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                {data.emoji}
              </span>
              <span className="text-center text-xs font-bold leading-tight text-white drop-shadow-md">
                {sport}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
