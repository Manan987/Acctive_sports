import type { Metadata } from "next";
import Link from "next/link";
import { site, FABRICS, SPORTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ACCTIVE Sports Industries is a Meerut-based manufacturer of premium sublimated sportswear for teams, clubs, schools and brands across India.",
  alternates: { canonical: "/about" },
};

const CAPABILITIES = [
  { title: "In-house Sublimation", desc: "Full-color, edge-to-edge printing with vibrant, fade-resistant results." },
  { title: "Custom Design Studio", desc: "We turn your brief into match-ready kits — names, numbers, logos, colours." },
  { title: "Bulk Manufacturing", desc: "Scalable production for teams, academies, schools and retail brands." },
  { title: "Quality Control", desc: "Every batch checked for stitch, print and fit before dispatch." },
];

const STEPS = [
  { n: "01", t: "Share your brief", d: "Send designs, colours, quantities and sizes." },
  { n: "02", t: "Get a quote & mockup", d: "We send pricing and a digital mockup for approval." },
  { n: "03", t: "Production", d: "We manufacture your order in-house with QC checks." },
  { n: "04", t: "Pan-India delivery", d: "Dispatched from Meerut to your doorstep." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-950 text-white">
        <div className="container-x py-16 md:py-24">
          <span className="badge bg-white/10 text-white">About {site.shortName}</span>
          <h1 className="mt-5 max-w-3xl font-display text-3xl font-extrabold sm:text-5xl">
            Premium sportswear, manufactured with pride in Meerut.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-200">
            {site.name} is a factory-direct manufacturer of custom sublimated sportswear.
            From collar and round-neck jerseys to shorts, lowers and full tracksuits, we
            help teams, clubs, schools and brands look and perform their best.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalogue" className="btn-primary">View Catalogue</Link>
            <Link href="/quote" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">Request a Quote</Link>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container-x py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Our Story</h2>
            <p className="mt-4 text-ink-600 dark:text-ink-300">
              Rooted in Meerut — one of India&apos;s sports manufacturing hubs — ACCTIVE was
              built on a simple idea: deliver professional-grade custom sportswear at
              factory-direct prices, without compromising on quality.
            </p>
            <p className="mt-4 text-ink-600 dark:text-ink-300">
              Today we produce 145+ designs across five product lines, serving athletes and
              organizations in cricket, football, basketball, badminton, hockey, tennis,
              boxing and athletics.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="card p-5">
                <h3 className="font-semibold text-ink-900 dark:text-white">{c.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fabrics + sports */}
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

      {/* Process */}
      <section className="container-x py-16 md:py-20">
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">How It Works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6">
              <span className="font-display text-2xl font-black text-flame-500">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
