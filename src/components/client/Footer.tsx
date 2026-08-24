import Link from "next/link";
import Image from "next/image";
import { site, fullAddress, whatsappLink } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-ink-800 bg-ink-950 text-white">
      {/* Gradient top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame-500 to-transparent" />

      {/* ── Product image strip ── */}
      <div className="relative grid grid-cols-3 overflow-hidden opacity-25" style={{ height: "180px" }}>
        {[
          "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png",
          "https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png",
          "https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png",
        ].map((src, i) => (
          <div key={i} className="relative overflow-hidden">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover object-center"
              sizes="33vw"
            />
          </div>
        ))}
        {/* Full bottom fade to footer bg */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
      </div>

      {/* ── Main footer grid ── */}
      <div className="container-x grid gap-10 pb-14 pt-8 md:grid-cols-4">
        {/* Brand column */}
        <div className="md:col-span-1">
          <Link href="/" aria-label="ACCTIVE Sports — Home">
            <Image
              src="https://res.cloudinary.com/rdhqircc/image/upload/v1787571541/WhatsApp_Image_2026-08-24_at_4.48.59_PM-removebg-preview_gabj92.png"
              alt="ACCTIVE Sports logo"
              width={220}
              height={72}
              className="h-16 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-ink-400">
            {site.tagline}. Vibrant sublimation, premium fabrics, custom designs and
            bulk orders with pan-India delivery.
          </p>

          {/* Social icons */}
          <div className="mt-5 flex gap-3">
            <a
              href={whatsappLink("Hi ACCTIVE, I'd like to enquire about your sportswear.")}
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink-700 bg-ink-900 text-ink-400 transition hover:border-green-500 hover:bg-green-500/10 hover:text-green-400"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink-700 bg-ink-900 text-ink-400 transition hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-400"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a
              href="https://www.indiamart.com/active-sportsindustries-uttarpradesh/our-products.html"
              target="_blank"
              rel="noopener"
              aria-label="IndiaMart"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink-700 bg-ink-900 text-ink-400 transition hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6h2v12H4V6zm14 0h-2v12h2V6zM8 6h3.5v7H8V6zm4.5 0H16v4.5h-3.5V6z" />
                <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="900" fontFamily="sans-serif" letterSpacing="-1.5">iM</text>
              </svg>
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-400">
            <li><Link href="/catalogue" className="transition hover:text-flame-400">Catalogue</Link></li>
            <li><Link href="/about" className="transition hover:text-flame-400">About Us</Link></li>
            <li><Link href="/contact" className="transition hover:text-flame-400">Contact</Link></li>
            <li><Link href="/cart" className="transition hover:text-flame-400">My Cart</Link></li>
          </ul>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-sm font-semibold text-white">Products</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-400">
            <li><Link href="/catalogue?category=collar-t-shirts" className="transition hover:text-flame-400">Collar T-Shirts</Link></li>
            <li><Link href="/catalogue?category=round-neck-t-shirts" className="transition hover:text-flame-400">Round Neck T-Shirts</Link></li>
            <li><Link href="/catalogue?category=shorts" className="transition hover:text-flame-400">Shorts</Link></li>
            <li><Link href="/catalogue?category=lowers" className="transition hover:text-flame-400">Lowers</Link></li>
            <li><Link href="/catalogue?category=tracksuits" className="transition hover:text-flame-400">Tracksuits</Link></li>
            <li><Link href="/catalogue?category=track-jackets" className="transition hover:text-flame-400">Track Jackets</Link></li>
          </ul>
        </div>

        {/* Contact + CTA */}
        <div>
          <h4 className="text-sm font-semibold text-white">Get in touch</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-400">
            <li className="leading-relaxed">{fullAddress}</li>
            {site.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s/g, "")}`} className="transition hover:text-flame-400">{p}</a>
              </li>
            ))}
            <li><a href={`mailto:${site.email}`} className="transition hover:text-flame-400">{site.email}</a></li>
          </ul>

          {/* CTA */}
          <div className="mt-6">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-xl border border-flame-500/40 bg-flame-500/10 px-4 py-2.5 text-sm font-semibold text-flame-400 transition hover:bg-flame-500 hover:text-white"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Trust Badges ── */}
      <div className="border-t border-ink-800">
        <div className="container-x flex flex-wrap items-center justify-center gap-6 py-5">
          {[
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Verified Manufacturer" },
            { icon: "M3 21V3h18v18H3zm3-3h12V6H6v12z", label: "Made in India 🇮🇳" },
            { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", label: "Factory Direct" },
            { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", label: "20+ Years" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-ink-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-flame-500/60">
                <path d={badge.icon} />
              </svg>
              <span className="text-xs font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-ink-800">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-500 sm:flex-row">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with ❤️ in Meerut, India 🇮🇳
          </p>
          <a
            href="#"
            className="hidden items-center gap-1 transition hover:text-flame-400 sm:flex"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
