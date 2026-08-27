import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getFeaturedProducts, getLatestProducts } from "@/lib/data";
import { ProductCard } from "@/components/client/ProductCard";
import { HeroCarousel } from "@/components/client/marketing/HeroCarousel";
import { TrustBadges } from "@/components/client/marketing/TrustBadges";
import { ShopBySport } from "@/components/client/marketing/ShopBySport";
import { CustomizeBanner } from "@/components/client/marketing/CustomizeBanner";
import { Capabilities } from "@/components/client/marketing/Capabilities";
import { Testimonials } from "@/components/client/marketing/Testimonials";
import { PartnersMarquee } from "@/components/client/marketing/PartnersMarquee";
import { StatsCounter } from "@/components/client/marketing/StatsCounter";
import { FAQ } from "@/components/client/marketing/FAQ";
import { NewsletterBanner } from "@/components/client/marketing/NewsletterBanner";
import { Reveal } from "@/components/client/marketing/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ORDER, DISCOUNTS, STATS } from "@/lib/site";

// Cloudinary product showcase images
const SHOWCASE_IMAGES = [
  { src: "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png", label: "Custom jerseys" },
  { src: "https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png", label: "Team kits" },
  { src: "https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png", label: "Bulk orders" },
];

export const dynamic = "force-dynamic";

// The root layout no longer sets a blanket canonical (it was being inherited by
// every page), so the homepage declares its own.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const WHY: { title: string; desc: string; icon: IconName }[] = [
  {
    title: "Vivid, long-lasting sublimation",
    desc: "Full-bleed, edge-to-edge printing that resists fading, cracking and peeling — wash after wash.",
    icon: "printer",
  },
  {
    title: "Sports-grade fabrics",
    desc: "Lycra, Superpoly, SAP Mattie, TPU and NS Lycra — breathable, sweat-wicking and built for performance.",
    icon: "layers",
  },
  {
    title: "100% custom designs",
    desc: "Your colours, names, numbers, logo and sponsor patches — tailored exactly to your brief, every time.",
    icon: "palette",
  },
  {
    title: "Bulk-ready manufacturing",
    desc: `From ${ORDER.minQty} piece to 5,000 — we scale without compromising quality. Built for teams, clubs and brands.`,
    icon: "package",
  },
  {
    title: "Pan-India delivery",
    desc: "Reliable, tracked shipping from our Meerut factory to every state in India.",
    icon: "truck",
  },
  {
    title: "Factory-direct pricing",
    desc: "Zero middlemen — you deal directly with the people making your kit, and pay accordingly.",
    icon: "factory",
  },
];

export default async function HomePage() {
  const [categories, featured, latest] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getLatestProducts(10),
  ]);

  return (
    <>
      <HeroCarousel />
      <TrustBadges />

      {/* ── Product showcase strip ─────────────────────── */}
      <section className="container-x section-tight">
        <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SHOWCASE_IMAGES.map((img) => (
            <Link
              key={img.src}
              href="/catalogue"
              className="group relative min-h-[240px] overflow-hidden rounded-2xl bg-ink-900"
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                className="object-cover object-center opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-flame-500 transition-transform duration-300 group-hover:scale-x-100" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {img.label}
                </span>
                <span className="-translate-x-1 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  <Icon name="arrowRight" size={16} strokeWidth={2.4} />
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* ── Shop by category ───────────────────────────── */}
      <section className="container-x section">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Our Full Range</p>
            <h2 className="section-heading mt-2">Shop by category</h2>
          </div>
          <Link
            href="/catalogue"
            className="hidden items-center gap-1 text-sm font-semibold text-flame-500 hover:underline sm:inline-flex"
          >
            View all
            <Icon name="arrowRight" size={15} />
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 60}>
              <Link
                href={`/catalogue?category=${cat.slug}`}
                className="group relative flex h-56 items-end overflow-hidden rounded-2xl bg-ink-900 p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-flame-500/15"
              >
                <Image
                  src={cat.image || SHOWCASE_IMAGES[i % SHOWCASE_IMAGES.length].src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-45 transition duration-500 group-hover:scale-105 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-flame-500 transition-transform duration-300 group-hover:scale-x-100" />
                <div className="relative">
                  <h3 className="text-xl font-bold">{cat.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-ink-200">
                    <span className="nums rounded-full bg-flame-500/20 px-2 py-0.5 text-xs font-bold text-flame-400">
                      {cat._count.products} designs
                    </span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      <Icon name="arrowRight" size={14} />
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Bestsellers ────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section border-y border-ink-100 bg-ink-50 dark:border-ink-800 dark:bg-ink-950/50">
          <div className="container-x">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Bestsellers</p>
                <h2 className="section-heading mt-2">Most-ordered designs</h2>
              </div>
              <Link
                href="/catalogue?sort=featured"
                className="hidden items-center gap-1 text-sm font-semibold text-flame-500 hover:underline sm:inline-flex"
              >
                See more
                <Icon name="arrowRight" size={15} />
              </Link>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Shop by sport ──────────────────────────────── */}
      <section className="container-x section">
        <Reveal className="text-center">
          <p className="eyebrow">Sport-Specific Kits</p>
          <h2 className="section-heading mt-2">Shop by sport</h2>
          <p className="section-sub mx-auto text-center">
            Performance kits engineered for the demands of each game — cut, fabric and fit chosen
            for the sport, not adapted from a generic block.
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <ShopBySport />
        </Reveal>
      </section>

      {/* ── How it works ───────────────────────────────── */}
      <section className="container-x pb-16 md:pb-24">
        <Reveal>
          <CustomizeBanner />
        </Reveal>
      </section>

      {/* ── New arrivals ───────────────────────────────── */}
      {latest.length > 0 && (
        <section className="container-x pb-16 md:pb-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Just Added</p>
              <h2 className="section-heading mt-2">New arrivals</h2>
            </div>
            <Link
              href="/catalogue?sort=newest"
              className="hidden items-center gap-1 text-sm font-semibold text-flame-500 hover:underline sm:inline-flex"
            >
              View all
              <Icon name="arrowRight" size={15} />
            </Link>
          </Reveal>
          <div className="no-scrollbar mt-8 flex gap-4 overflow-x-auto pb-2">
            {latest.map((p) => (
              <div key={p.id} className="w-44 shrink-0 sm:w-56">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Why us ─────────────────────────────────────── */}
      <section className="section border-t border-ink-100 bg-ink-50 dark:border-ink-800 dark:bg-ink-950/50">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Why Choose ACCTIVE</p>
            <h2 className="section-heading mt-2">
              Built in-house. Delivered on time. Every time.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={(i % 3) * 60}>
                <div className="card h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-flame-500/10 text-flame-500">
                    <Icon name={w.icon} size={21} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink-900 dark:text-white">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                    {w.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats band ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-950 py-16 text-white">
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-flame-500/15 blur-[110px]" />
        <div className="container-x relative">
          <StatsCounter />
        </div>
      </section>

      {/* ── What we manufacture ────────────────────────── */}
      <section className="container-x section">
        <Reveal>
          <Capabilities />
        </Reveal>
      </section>

      {/* ── Customer feedback ──────────────────────────── */}
      <section className="section border-t border-ink-100 bg-ink-50 dark:border-ink-800 dark:bg-ink-950/50">
        <div className="container-x">
          <Reveal className="text-center">
            <p className="eyebrow">What Our Customers Say</p>
            <h2 className="section-heading mt-2">
              Trusted by teams, academies and brands across India
            </h2>
          </Reveal>
          <div className="mt-10">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* ── Segments served ────────────────────────────── */}
      <section className="border-y border-ink-100 py-8 dark:border-ink-800">
        <p className="container-x mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
          Supplying and manufacturing for
        </p>
        <PartnersMarquee />
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section className="container-x pb-4 pt-16 md:pt-24">
        <Reveal className="text-center">
          <p className="eyebrow">Common Questions</p>
          <h2 className="section-heading mt-2">Everything you need to know before ordering</h2>
        </Reveal>
        <div className="mt-10">
          <FAQ />
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────── */}
      <section className="container-x pb-4 pt-12">
        <Reveal>
          <NewsletterBanner />
        </Reveal>
      </section>

      {/* ── Final CTA ──────────────────────────────────── */}
      <section className="container-x section">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-950 via-flame-950 to-ink-900 px-8 py-16 text-center text-white md:py-24">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-flame-500/25 blur-[120px]" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-electric-500/15 blur-[120px]" />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
              <Icon name="award" size={15} className="text-flame-500" />
              Trusted by teams, academies and brands across India
            </span>
            <h2 className="mt-6 text-3xl font-extrabold sm:text-5xl">
              Your next kit is one order away.
            </h2>
            <p className="mt-4 text-lg text-ink-200">
              {STATS.designs} designs to choose from. Free mockup first. Manufactured, packed and
              delivered pan-India by the people who made it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/catalogue" className="btn-primary btn-lg">
                Browse all designs
                <Icon name="arrowRight" size={17} />
              </Link>
              <Link href="/contact" className="btn-on-dark btn-lg">
                Talk to our team
              </Link>
            </div>
            <p className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink-400">
              {[
                `Free mockup on every order`,
                `Order from ${ORDER.minQty} piece`,
                `${DISCOUNTS.bulk.pct}% off at ${DISCOUNTS.bulk.minQty}+ pieces`,
                `Pan-India delivery`,
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Icon name="check" size={14} className="text-flame-500" />
                  {t}
                </span>
              ))}
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
