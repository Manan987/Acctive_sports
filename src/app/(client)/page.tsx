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
import { Reveal } from "@/components/client/marketing/Reveal";

export const dynamic = "force-dynamic";

const WHY = [
  { title: "Vibrant Sublimation", desc: "Edge-to-edge, fade-proof prints that stay bright wash after wash.", icon: "M12 3v18M3 12h18" },
  { title: "Premium Fabrics", desc: "Lycra, Superpoly, SAP Mattie, TPU & more — breathable and durable.", icon: "M4 7h16M4 12h16M4 17h10" },
  { title: "Custom Designs", desc: "Your name, numbers, logo and colours — designed to your brief.", icon: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" },
  { title: "Bulk Orders", desc: "Built for teams, clubs, schools and brands at factory pricing.", icon: "M3 3h18v4H3zM3 10h18v11H3z" },
  { title: "Pan-India Delivery", desc: "Reliable dispatch from our Meerut unit to anywhere in India.", icon: "M3 12h18M3 12a9 9 0 0 1 18 0M12 3v18" },
  { title: "Factory Direct", desc: "No middlemen — manufactured in-house for quality and price control.", icon: "M2 20h20L12 4z" },
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

      {/* Shop by Category */}
      <section className="container-x py-16 md:py-20">
        <Reveal className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Our Range</p>
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
                className="group relative flex h-52 items-end overflow-hidden rounded-2xl bg-ink-900 p-6 text-white transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <Image
                  src={cat.image || "/placeholder-product.svg"}
                  alt=""
                  fill
                  className="object-cover opacity-35 transition duration-500 group-hover:scale-110 group-hover:opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                <div className="relative">
                  <h3 className="font-display text-xl font-bold">{cat.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-ink-200">
                    {cat._count.products} designs
                    <span className="transition group-hover:translate-x-1">→</span>
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
                <p className="eyebrow">Crowd Pleasers</p>
                <h2 className="section-heading mt-2">Featured Designs</h2>
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
          <p className="eyebrow">Built for every game</p>
          <h2 className="section-heading mt-2">Shop by Sport</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-500 dark:text-ink-400">
            Kits engineered for the demands of each sport.
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
              <p className="eyebrow">Fresh off the press</p>
              <h2 className="section-heading mt-2">New on the Shelf</h2>
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
            <p className="eyebrow">Why ACCTIVE</p>
            <h2 className="section-heading mt-2">A factory built for quality &amp; scale</h2>
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
      <section className="relative overflow-hidden bg-ink-950 bg-grid py-16 text-white">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-flame-500/20 blur-[110px]" />
        <div className="container-x relative">
          <StatsCounter />
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-x py-16 md:py-20">
        <Reveal className="text-center">
          <p className="eyebrow">What buyers say</p>
          <h2 className="section-heading mt-2">Trusted by teams across India</h2>
        </Reveal>
        <div className="mt-10">
          <Testimonials />
        </div>
      </section>

      {/* Partners marquee */}
      <section className="border-y border-ink-100 py-8 dark:border-ink-800">
        <p className="container-x mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
          Manufacturing for
        </p>
        <PartnersMarquee />
      </section>

      {/* Final CTA */}
      <section className="container-x py-16 md:py-20">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-flame-600 to-flame-500 px-8 py-14 text-center text-white md:py-20">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-[90px]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Ready to kit out your team?
            </h2>
            <p className="mt-4 text-white/90">
              Send us your design brief and quantities — we&apos;ll get back with a custom
              quote and a free digital mockup.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/quote" className="btn-lg btn bg-white text-flame-600 hover:bg-ink-50">
                Request a Quote
              </Link>
              <Link href="/contact" className="btn-lg btn border border-white/40 bg-white/10 text-white hover:bg-white/20">
                Talk to Us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
