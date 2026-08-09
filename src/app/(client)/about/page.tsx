import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, FABRICS, SPORTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ACCTIVE Sports Industries is a Meerut-based manufacturer of premium sublimated sportswear for teams, clubs, schools and brands across India.",
  alternates: { canonical: "/about" },
};

const CAPABILITIES = [
  { title: "In-house Sublimation", desc: "Full-color, edge-to-edge printing with vibrant, fade-resistant results.", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { title: "Custom Design Studio", desc: "We turn your brief into match-ready kits — names, numbers, logos, colours.", icon: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" },
  { title: "Bulk Manufacturing", desc: "Scalable production for teams, academies, schools and retail brands.", icon: "M3 3h18v4H3zM3 10h18v11H3z" },
  { title: "Quality Control", desc: "Every batch checked for stitch, print and fit before dispatch.", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
];

const STEPS = [
  { n: "01", t: "Share your brief", d: "Send designs, colours, quantities and sizes." },
  { n: "02", t: "Get a quote & mockup", d: "We send pricing and a digital mockup for approval." },
  { n: "03", t: "Production", d: "We manufacture your order in-house with QC checks." },
  { n: "04", t: "Pan-India delivery", d: "Dispatched from Meerut to your doorstep." },
];

const STATS = [
  { value: "300+", label: "Designs" },
  { value: "10K+", label: "Kits Delivered" },
  { value: "8", label: "Sports Covered" },
  { value: "100%", label: "Customizable" },
];

// Product showcase images from Cloudinary
const PRODUCT_IMAGES = [
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png",
];

export default function AboutPage() {
  return (
    <div>
      {/* ── Hero with video background ─────────────────── */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        >
          <source
            src="https://res.cloudinary.com/rdhqircc/video/upload/v1786295693/gemini_generated_video_26B45789_flyulq.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950/90 via-ink-950/70 to-flame-950/60" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-flame-500/20 blur-[140px]" />

        <div className="container-x relative py-20 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
            About {site.shortName}
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight drop-shadow-xl sm:text-5xl lg:text-6xl">
            Premium sportswear,{" "}
            <span className="gradient-text-animated">manufactured with pride</span>{" "}
            in Meerut.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-200/90">
            {site.name} is a factory-direct manufacturer of custom sublimated sportswear.
            From collar and round-neck jerseys to shorts, lowers and full tracksuits, we
            help teams, clubs, schools and brands look and perform their best.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalogue" className="btn-primary btn-lg pulse-glow">
              View Catalogue
            </Link>
            <Link href="/contact" className="btn-lg btn border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
              Request a Quote
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-left">
                <div className="font-display text-3xl font-extrabold text-flame-400 drop-shadow">{s.value}</div>
                <div className="mt-1 text-sm uppercase tracking-widest text-ink-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story — image split layout ─────────────── */}
      <section className="container-x py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text side */}
          <div>
            <p className="eyebrow">Our Story</p>
            <h2 className="section-heading mt-2">
              Built in the sports capital of India
            </h2>
            <p className="mt-5 text-ink-600 dark:text-ink-300 leading-relaxed">
              Rooted in Meerut — one of India&apos;s sports manufacturing hubs — ACCTIVE was
              built on a simple idea: deliver professional-grade custom sportswear at
              factory-direct prices, without compromising on quality.
            </p>
            <p className="mt-4 text-ink-600 dark:text-ink-300 leading-relaxed">
              Today we produce 300+ designs across five product lines, serving athletes and
              organizations in cricket, football, basketball, badminton, hockey, tennis,
              boxing and athletics.
            </p>
            {/* Capability cards */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {CAPABILITIES.map((c) => (
                <div key={c.title} className="card p-4 hover:-translate-y-1 transition-transform duration-200">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-flame-500/10 text-flame-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={c.icon} />
                    </svg>
                  </span>
                  <h3 className="mt-3 font-semibold text-ink-900 dark:text-white text-sm">{c.title}</h3>
                  <p className="mt-1 text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              {/* Tall left image */}
              <div className="relative row-span-2 overflow-hidden rounded-2xl">
                <Image
                  src={PRODUCT_IMAGES[0]}
                  alt="ACCTIVE sportswear product"
                  width={400}
                  height={600}
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
              </div>
              {/* Top right */}
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src={PRODUCT_IMAGES[1]}
                  alt="ACCTIVE sportswear product"
                  width={400}
                  height={290}
                  className="h-44 w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
              </div>
              {/* Bottom right */}
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src={PRODUCT_IMAGES[2]}
                  alt="ACCTIVE sportswear product"
                  width={400}
                  height={290}
                  className="h-44 w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
                {/* Badge overlay */}
                <div className="absolute bottom-3 left-3 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  <p className="text-xs font-bold text-white">Factory Direct 🏭</p>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-flame-500/30 bg-white px-4 py-3 shadow-xl dark:bg-ink-900">
              <p className="font-display text-2xl font-black text-flame-500">300+</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">Designs to choose from</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Video showcase band ──────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-950 py-20 text-white">

        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-flame-500/20 blur-[120px]" />

        <div className="container-x relative text-center">
          <p className="eyebrow text-flame-400">Watch us work</p>
          <h2 className="section-heading mt-2">Premium kits, crafted in-house</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-300">
            Every jersey is cut, printed and stitched under one roof in Meerut. No third parties, no compromises.
          </p>
          <Link href="/catalogue" className="btn-primary btn-lg mt-8 pulse-glow inline-flex">
            Explore the Catalogue →
          </Link>
        </div>
      </section>

      {/* ── Fabrics + sports ─────────────────────────────── */}
      <section className="border-y border-ink-100 bg-ink-50 py-16 dark:border-ink-800 dark:bg-ink-950/50">
        <div className="container-x grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-extrabold">Premium Fabrics</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {FABRICS.map((f) => (
                <span key={f} className="badge bg-white text-ink-700 dark:bg-ink-900 dark:text-ink-200">{f}</span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-extrabold">Sports We Cover</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {SPORTS.map((s) => (
                <span key={s} className="badge bg-white text-ink-700 dark:bg-ink-900 dark:text-ink-200">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────── */}
      <section className="container-x py-16 md:py-20">
        <p className="eyebrow">Simple &amp; transparent</p>
        <h2 className="section-heading mt-2">How It Works</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative card p-6 hover:-translate-y-1 transition-transform duration-200">
              {/* connector */}
              {i < STEPS.length - 1 && (
                <div className="absolute -right-2 top-9 hidden h-px w-4 bg-gradient-to-r from-flame-500/50 to-transparent lg:block" />
              )}
              <span className="font-display text-3xl font-black text-flame-500">{s.n}</span>
              <h3 className="mt-3 font-semibold text-ink-900 dark:text-white">{s.t}</h3>
              <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{s.d}</p>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/catalogue" className="btn-primary btn-lg">Browse Catalogue</Link>
          <Link href="/contact" className="btn-secondary btn-lg">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
