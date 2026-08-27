import Link from "next/link";
import Image from "next/image";
import { site, fullAddress, whatsappLink, STATS } from "@/lib/site";
import { Icon, InstagramIcon } from "@/components/ui/Icon";

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
              aria-label="Contact us on WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink-700 bg-ink-900 text-ink-400 transition hover:border-green-500 hover:bg-green-500/10 hover:text-green-400"
            >
              <Icon name="whatsapp" size={16} />
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Follow us on Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink-700 bg-ink-900 text-ink-400 transition hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-400"
            >
              <InstagramIcon size={16} />
            </a>
            {/* IndiaMART has no icon in the set; a wordmark is honest and legible.
                The previous version nested a <text> node inside a path-only SVG,
                which rendered as an unreadable smudge at 17px. */}
            <a
              href="https://www.indiamart.com/active-sportsindustries-uttarpradesh/our-products.html"
              target="_blank"
              rel="noopener"
              aria-label="View our IndiaMART storefront"
              className="grid h-9 place-items-center rounded-full border border-ink-700 bg-ink-900 px-3 text-[10px] font-bold uppercase tracking-wide text-ink-400 transition hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400"
            >
              IndiaMART
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
              Shop now
              <Icon name="arrowRight" size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Trust badges ── */}
      <div className="border-t border-ink-800">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
          {([
            { icon: "shieldCheck", label: "Verified manufacturer" },
            { icon: "globe", label: "Made in India" },
            { icon: "factory", label: "Factory direct" },
            { icon: "award", label: `${STATS.yearsInTrade} years in trade` },
          ] as const).map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-ink-500">
              <span className="text-flame-500/70">
                <Icon name={badge.icon} size={15} />
              </span>
              <span className="text-xs font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-ink-800">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-500 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>Designed and manufactured in Meerut, Uttar Pradesh</p>
          {/* href="#" scrolled nowhere. An in-page anchor to the top of the
              document is a real link, works without JS, and keeps focus sane. */}
          <a
            href="#top"
            className="hidden items-center gap-1.5 transition hover:text-flame-400 sm:flex"
          >
            Back to top
            <Icon name="chevronDown" size={13} className="rotate-180" />
          </a>
        </div>
      </div>
    </footer>
  );
}
