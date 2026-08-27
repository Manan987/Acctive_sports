import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, FABRICS, SPORTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us — ACCTIVE Sports Industries",
  description:
    "Discover ACCTIVE Sports Industries — founded by Shivinder Sharma in Meerut, your go-to destination for premium sublimated sportswear. Rich history, expert craftsmanship, pan-India delivery.",
  alternates: { canonical: "/about" },
};

const CAPABILITIES = [
  {
    title: "In-house Sublimation",
    desc: "Full-color, edge-to-edge printing with vibrant, fade-resistant results on every garment.",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    title: "Custom Design Studio",
    desc: "We turn your brief into match-ready kits — names, numbers, logos, colours.",
    icon: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z",
  },
  {
    title: "Bulk Manufacturing",
    desc: "Scalable production for teams, academies, schools and retail brands.",
    icon: "M3 3h18v4H3zM3 10h18v11H3z",
  },
  {
    title: "Quality Control",
    desc: "Every batch checked for stitch, print and fit before dispatch.",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  },
  {
    title: "Textile Engineers",
    desc: "Skilled professionals ensuring excellence in every stitch and print operation.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Pan-India Delivery",
    desc: "Advanced logistics with extensive sales offices delivering across India reliably.",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
];

const STEPS = [
  { n: "01", t: "Share your brief", d: "Send designs, colours, quantities and sizes via WhatsApp or email." },
  { n: "02", t: "Get a quote & mockup", d: "We send pricing and a digital mockup for your approval." },
  { n: "03", t: "Production", d: "We manufacture your order in-house with thorough QC checks." },
  { n: "04", t: "Pan-India delivery", d: "Dispatched from Meerut directly to your doorstep." },
];

const STATS = [
  { value: "2003", label: "Founded" },
  { value: "300+", label: "Designs" },
  { value: "10K+", label: "Kits Delivered" },
  { value: "100%", label: "Customizable" },
];

const VALUES = [
  {
    title: "Quality First",
    desc: "Quality reigns supreme at ACCTIVE. We adhere to the highest standards throughout our manufacturing process, meticulously crafting each garment to perfection.",
    color: "from-flame-500 to-orange-600",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Customer Focus",
    desc: "Our commitment to customer satisfaction ensures comfort and functionality in every product. We strive to exceed the expectations of our valued customers.",
    color: "from-blue-500 to-cyan-600",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    title: "Innovation",
    desc: "With advanced manufacturing techniques and vibrant sublimation technology, we keep pushing the boundaries of what is possible in sportswear.",
    color: "from-purple-500 to-violet-600",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const PRODUCT_RANGE = [
  "Men's Polo T-Shirts",
  "Round Neck T-Shirts",
  "Printed Hooded Jackets",
  "Polyester Lycra Cycling Dresses",
  "Shorts & Lowers",
  "Full Tracksuits",
  "Track Jackets",
  "Custom Team Kits",
];

const PRODUCT_IMAGES = [
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png",
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
        >
          <source
            src="https://res.cloudinary.com/rdhqircc/video/upload/v1786295693/gemini_generated_video_26B45789_flyulq.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950/95 via-ink-950/75 to-flame-950/60" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-flame-500/20 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="container-x relative py-24 md:py-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-flame-400/30 bg-flame-500/10 px-4 py-1.5 text-sm font-semibold text-flame-300 backdrop-blur-sm">
            About ACCTIVE Sports Industries
          </span>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-tight drop-shadow-xl sm:text-5xl lg:text-6xl">
            Discover{" "}
            <span className="gradient-text-animated">ACCTIVE Sports</span>
            {" "}— your go-to destination for premium sportswear.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-200/90">
            Founded by <strong className="text-white font-bold">Shivinder Sharma</strong> in Meerut —
            India&apos;s sports manufacturing capital — ACCTIVE has been elevating performance
            and style since 2003.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalogue" className="btn-primary btn-lg pulse-glow">
              View Catalogue
            </Link>
            <Link href="/contact" className="btn-lg btn border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
              Request a Quote
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm text-left">
                <div className="font-display text-3xl font-extrabold text-flame-400 drop-shadow">{s.value}</div>
                <div className="mt-1 text-sm uppercase tracking-widest text-ink-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container-x py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Our Story</p>
            <h2 className="section-heading mt-2">Built in the sports capital of India</h2>

            <div className="mt-5 space-y-4 text-ink-600 dark:text-ink-300 leading-relaxed">
              <p>
                The ACCTIVE Sports Industry in <strong className="text-ink-900 dark:text-white">Meerut</strong>,
                founded by <strong className="text-ink-900 dark:text-white">Shivinder Sharma</strong>,
                has a rich history dating back several decades. Meerut has been a hub for sports goods
                manufacturing and has played a significant role in the growth of the sports industry in India.
              </p>
              <p>
                As a former venture of <em>Pt. Sohan Lal and Sons Hockey makers</em>, ACCTIVE took a vibrant
                turn in <strong className="text-flame-500">2003</strong>, establishing itself as a brand
                dedicated to helping athletes elevate their performance and style.
              </p>
              <p>
                Today we produce 300+ designs across multiple product lines, serving athletes,
                teams, academies, schools and brands across every major sport in India.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-flame-500/20 bg-flame-500/5 p-5">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-flame-500 text-white">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-ink-900 dark:text-white">20+ Years of Excellence</p>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">
                  From hockey roots to a full-spectrum sportswear brand, our legacy speaks for itself.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative row-span-2 overflow-hidden rounded-2xl" style={{ minHeight: "380px" }}>
                <Image
                  src={PRODUCT_IMAGES[0]}
                  alt="ACCTIVE sportswear product"
                  fill
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
              </div>
              <div className="relative overflow-hidden rounded-2xl" style={{ height: "184px" }}>
                <Image
                  src={PRODUCT_IMAGES[1]}
                  alt="ACCTIVE sportswear product"
                  fill
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
              </div>
              <div className="relative overflow-hidden rounded-2xl" style={{ height: "184px" }}>
                <Image
                  src={PRODUCT_IMAGES[2]}
                  alt="ACCTIVE sportswear product"
                  fill
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  <p className="text-xs font-bold text-white">Factory Direct</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-flame-500/30 bg-white px-4 py-3 shadow-xl dark:bg-ink-900">
              <p className="font-display text-2xl font-black text-flame-500">300+</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">Designs to choose from</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="relative overflow-hidden bg-ink-950 py-20 text-white">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute left-1/3 top-0 h-72 w-72 rounded-full bg-flame-500/15 blur-[120px]" />
        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center">
            <svg className="mx-auto mb-6 h-10 w-10 text-flame-400 opacity-60" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
            </svg>
            <blockquote className="font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
              Experience the difference that quality makes with{" "}
              <span className="gradient-text-animated">ACCTIVE Sports Industries.</span>
            </blockquote>
            <p className="mt-6 text-ink-300">
              Our commitment to excellence is unwavering. We strive to exceed the expectations
              of our valued customers — garment by garment, stitch by stitch.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
              <Image
                src="https://res.cloudinary.com/rdhqircc/image/upload/v1787571541/WhatsApp_Image_2026-08-24_at_4.48.59_PM-removebg-preview_gabj92.png"
                alt="ACCTIVE Sports"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <div className="text-left">
                <p className="text-sm font-bold text-white">Shivinder Sharma</p>
                <p className="text-xs text-ink-400">Founder, ACCTIVE Sports Industries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="container-x py-20 md:py-28">
        <div className="text-center">
          <p className="eyebrow">What We Stand For</p>
          <h2 className="section-heading mt-2">Our Core Values</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-500 dark:text-ink-400">
            At ACCTIVE, quality reigns supreme. Every value we hold is reflected in every
            garment we craft.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-ink-800 dark:bg-ink-900"
            >
              <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${v.color} opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20`} />
              <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${v.color} text-white shadow-lg`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={v.icon} />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink-900 dark:text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Range */}
      <section className="border-y border-ink-100 bg-ink-50 py-16 dark:border-ink-800 dark:bg-ink-950/50">
        <div className="container-x">
          <div className="text-center">
            <p className="eyebrow">What We Make</p>
            <h2 className="section-heading mt-2">Our Product Range</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-500 dark:text-ink-400">
              We offer a wide range of high-quality garments designed for performance, comfort and style.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {PRODUCT_RANGE.map((p) => (
              <span
                key={p}
                className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-700 shadow-sm transition hover:border-flame-400 hover:text-flame-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-flame-500" />
                {p}
              </span>
            ))}
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-display text-xl font-extrabold text-ink-900 dark:text-white">Premium Fabrics</h3>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400 mb-4">Carefully sourced materials for durability, breathability and comfort.</p>
              <div className="flex flex-wrap gap-2">
                {FABRICS.map((f) => (
                  <span key={f} className="badge bg-white text-ink-700 dark:bg-ink-900 dark:text-ink-200">{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-extrabold text-ink-900 dark:text-white">Sports We Cover</h3>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400 mb-4">Kits for every sport, custom-designed for your team identity.</p>
              <div className="flex flex-wrap gap-2">
                {SPORTS.map((s) => (
                  <span key={s} className="badge bg-white text-ink-700 dark:bg-ink-900 dark:text-ink-200">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="container-x py-20 md:py-28">
        <div className="text-center">
          <p className="eyebrow">Why Choose Us</p>
          <h2 className="section-heading mt-2">Our Capabilities</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-500 dark:text-ink-400">
            Our team of skilled professionals — including textile engineers — ensures
            excellence in operations, with advanced manufacturing and unmatched reliability.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="card group p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-flame-500/10 text-flame-500 transition-colors group-hover:bg-flame-500 group-hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={c.icon} />
                </svg>
              </span>
              <h3 className="mt-4 font-semibold text-ink-900 dark:text-white">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative overflow-hidden bg-ink-950 py-20 text-white">
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-flame-500/20 blur-[120px]" />
        <div className="container-x relative">
          <div className="text-center">
            <p className="eyebrow text-flame-400">Simple &amp; transparent</p>
            <h2 className="section-heading mt-2">How It Works</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-300">
              From idea to delivery — our streamlined process makes getting your custom
              sportswear easy and reliable.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10">
                {i < STEPS.length - 1 && (
                  <div className="absolute -right-2 top-9 hidden h-px w-4 bg-gradient-to-r from-flame-500/50 to-transparent lg:block" />
                )}
                <span className="font-display text-4xl font-black text-flame-500">{s.n}</span>
                <h3 className="mt-3 font-semibold text-white">{s.t}</h3>
                <p className="mt-1.5 text-sm text-ink-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20 md:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-flame-500 to-orange-600 p-10 text-white shadow-2xl md:p-14">
          <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-52 w-52 rounded-full bg-black/10 blur-2xl" />
          <div className="relative text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-white/70">Experience the difference</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Ready to elevate your team&apos;s performance?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Contact us today to get a free quote and digital mockup. Pan-India delivery
              from Meerut to your doorstep.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/catalogue"
                className="rounded-xl bg-white px-8 py-3 font-bold text-flame-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Browse Catalogue
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/30 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
