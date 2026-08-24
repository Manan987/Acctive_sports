import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getFeaturedProducts, getLatestProducts } from "@/lib/data";
import { ProductCard } from "@/components/client/ProductCard";
import { HeroCarousel } from "@/components/client/marketing/HeroCarousel";
import { TrustBadges } from "@/components/client/marketing/TrustBadges";
import { ShopBySport } from "@/components/client/marketing/ShopBySport";
import { CustomizeBanner } from "@/components/client/marketing/CustomizeBanner";
import { Testimonials } from "@/components/client/marketing/Testimonials";
import { PartnersMarquee } from "@/components/client/marketing/PartnersMarquee";
import { StatsCounter } from "@/components/client/marketing/StatsCounter";
import { FAQ } from "@/components/client/marketing/FAQ";
import { NewsletterBanner } from "@/components/client/marketing/NewsletterBanner";
import { Reveal } from "@/components/client/marketing/Reveal";

// Cloudinary product showcase images
const SHOWCASE_IMAGES = [
  { src: "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png", label: "Custom Jerseys" },
  { src: "https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png", label: "Team Kits" },
  { src: "https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png", label: "Bulk Orders" },
];

export const dynamic = "force-dynamic";

// The root layout no longer sets a blanket canonical (it was being inherited by
// every page), so the homepage declares its own.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const WHY = [
  { title: "Vivid, Long-Lasting Sublimation", desc: "Full-bleed, edge-to-edge printing that resists fading, cracking & peeling — even after repeated washing.", icon: "M12 3v18M3 12h18" },
  { title: "Sports-Grade Fabrics", desc: "Lycra, Superpoly, SAP Mattie, TPU & NS Lycra — breathable, sweat-wicking and built for performance.", icon: "M4 7h16M4 12h16M4 17h10" },
  { title: "100% Custom Designs", desc: "Your colours, names, numbers, logo and sponsor patches — tailored exactly to your brief, every time.", icon: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" },
  { title: "Bulk-Ready Manufacturing", desc: "From 50 to 5,000 pieces — we scale without compromising quality. Perfect for teams, clubs and brands.", icon: "M3 3h18v4H3zM3 10h18v11H3z" },
  { title: "Pan-India Delivery", desc: "Reliable, tracked shipping from our Meerut factory to every state in India — on time, every time.", icon: "M3 12h18M3 12a9 9 0 0 1 18 0M12 3v18" },
  { title: "Factory-Direct Pricing", desc: "Zero middlemen — you deal directly with us and get the best price without sacrificing quality.", icon: "M2 20h20L12 4z" },
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

      {/* ── Product showcase image strip ─────────────── */}
      <section className="container-x py-10 md:py-14">
        <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SHOWCASE_IMAGES.map((img, i) => (
            <Link
              key={i}
              href="/catalogue"
              className="group relative overflow-hidden rounded-2xl bg-ink-900"
              style={{ minHeight: "240px" }}
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                className="object-cover object-center opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-flame-500 to-electric-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-4 left-4">
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {img.label}
                </span>
              </div>
              <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 p-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* Shop by Category */}
      <section className="container-x py-16 md:py-20">
        <Reveal className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Our Full Range</p>
            <h2 className="section-heading mt-2">Shop by Category</h2>
          </div>
          <Link href="/catalogue" className="hidden text-sm font-semibold text-flame-500 hover:underline sm:block">
            View all →
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 60}>
              <Link
                href={`/catalogue?category=${cat.slug}`}
                className="group relative flex h-56 items-end overflow-hidden rounded-2xl bg-ink-900 p-6 text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-flame-500/20"
              >
                <Image
                  src={cat.image || SHOWCASE_IMAGES[i % 3].src}
                  alt=""
                  fill
                  className="object-cover opacity-40 transition duration-500 group-hover:scale-110 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
                {/* Flame accent on hover */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-flame-500 to-electric-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <h3 className="font-display text-xl font-bold">{cat.name}</h3>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-200">
                    <span className="rounded-full bg-flame-500/20 px-2 py-0.5 text-xs font-bold text-flame-400">{cat._count.products} designs</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured / Crowd Pleasers */}
      {featured.length > 0 && (
        <section className="border-y border-ink-100 bg-ink-50 py-16 dark:border-ink-800 dark:bg-ink-950/50 md:py-20">
          <div className="container-x">
            <Reveal className="flex items-end justify-between">
              <div>
                <p className="eyebrow">Bestsellers</p>
                <h2 className="section-heading mt-2">Most-Ordered Designs</h2>
              </div>
              <Link href="/catalogue?sort=featured" className="hidden text-sm font-semibold text-flame-500 hover:underline sm:block">
                See more →
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

      {/* Shop by Sport */}
      <section className="container-x py-16 md:py-20">
        <Reveal className="text-center">
          <p className="eyebrow">Sport-Specific Kits</p>
          <h2 className="section-heading mt-2">Shop by Sport</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-500 dark:text-ink-400">
            Performance kits engineered for the unique demands of each sport — cut, fabric and fit chosen for the game.
          </p>
        </Reveal>
        <Reveal className="mt-8">
          <ShopBySport />
        </Reveal>
      </section>

      {/* Customize banner */}
      <section className="container-x pb-16 md:pb-20">
        <Reveal>
          <CustomizeBanner />
        </Reveal>
      </section>

      {/* New arrivals */}
      {latest.length > 0 && (
        <section className="container-x pb-16 md:pb-20">
          <Reveal className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Just Dropped</p>
              <h2 className="section-heading mt-2">New Arrivals</h2>
            </div>
            <Link href="/catalogue?sort=newest" className="hidden text-sm font-semibold text-flame-500 hover:underline sm:block">
              View all →
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

      {/* Why us */}
      <section className="border-t border-ink-100 bg-ink-50 py-16 dark:border-ink-800 dark:bg-ink-950/50 md:py-20">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Why Choose ACCTIVE</p>
            <h2 className="section-heading mt-2">Built in-house. Delivered on time. Every time.</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={(i % 3) * 60}>
                <div className="card h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-flame-500/10 text-flame-500">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={w.icon} />
                    </svg>
                  </span>
                  <h3 className="mt-4 font-semibold text-ink-900 dark:text-white">{w.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative overflow-hidden bg-ink-950 py-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/70 to-ink-950/90" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-flame-500/20 blur-[110px]" />
        <div className="container-x relative">
          <StatsCounter />
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-x py-16 md:py-20">
        <Reveal className="text-center">
          <p className="eyebrow">Real Customers, Real Results</p>
          <h2 className="section-heading mt-2">Trusted by teams, academies & brands across India</h2>
        </Reveal>
        <div className="mt-10">
          <Testimonials />
        </div>
      </section>

      {/* Partners marquee */}
      <section className="border-y border-ink-100 py-8 dark:border-ink-800">
        <p className="container-x mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
          Supplying & Manufacturing for
        </p>
        <PartnersMarquee />
      </section>

      {/* FAQ */}
      <section className="container-x pb-4 pt-16 md:pt-20">
        <Reveal className="text-center">
          <p className="eyebrow">Got Questions?</p>
          <h2 className="section-heading mt-2">Everything you need to know before ordering</h2>
        </Reveal>
        <div className="mt-10">
          <FAQ />
        </div>
      </section>

      {/* Newsletter banner */}
      <section className="container-x pb-4 pt-10">
        <Reveal>
          <NewsletterBanner />
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="container-x py-16 md:py-20">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-950 via-flame-950 to-ink-900 px-8 py-16 text-center text-white md:py-24">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-flame-500/30 blur-[120px]" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-electric-500/20 blur-[120px]" />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
              🏆 Trusted by 500+ teams & academies across India
            </span>
            <h2 className="mt-6 font-display text-3xl font-extrabold sm:text-5xl">
              Your next kit is one order away.
            </h2>
            <p className="mt-4 text-lg text-ink-200">
              Choose from 300+ designs. Get a free mockup first. Pay only when you're happy.
              We manufacture, pack and deliver — pan-India.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/catalogue" className="btn-lg btn bg-flame-500 text-white shadow-xl shadow-flame-500/40 hover:bg-flame-600 pulse-glow">
                🛒 Browse All Designs
              </Link>
              <Link href="/contact" className="btn-lg btn border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                💬 WhatsApp Us
              </Link>
            </div>
            <p className="mt-6 text-sm text-ink-400">Free mockup on every order &middot; MOQ 50 pcs &middot; Pan-India delivery &middot; No advance for mockup</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
