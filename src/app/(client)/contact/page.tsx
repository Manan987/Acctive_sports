import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/client/ContactForm";
import { site, fullAddress, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with ACCTIVE Sports Industries, Meerut. Call, email or WhatsApp us for custom sportswear quotes and bulk orders.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(fullAddress);
  return (
    <div>
      {/* ── Hero with video background ─────────────────── */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
        >
          <source
            src="https://res.cloudinary.com/rdhqircc/video/upload/v1786214195/gemini_generated_video_1A145FD7_k8kfmh.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950/90 via-ink-950/70 to-flame-950/60" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-flame-500/20 blur-[140px]" />

        <div className="container-x relative py-16 md:py-24">
          <p className="eyebrow text-flame-400">Get in touch</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold drop-shadow-xl sm:text-5xl">
            Let&apos;s build your{" "}
            <span className="gradient-text-animated">perfect kit</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-300">
            Questions, custom designs or bulk enquiries — we&apos;re here to help.
            Reach out and our team will respond quickly.
          </p>

          {/* Quick contact pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappLink("Hi ACCTIVE, I'd like to enquire about your sportswear.")}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400 backdrop-blur-sm transition hover:bg-green-500/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              {site.email}
            </a>
          </div>
        </div>
      </section>

      {/* ── Product image accent strip ──────────────────── */}
      <div className="relative -mt-1 grid grid-cols-3 overflow-hidden" style={{ height: "120px" }}>
        {[
          "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png",
          "https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png",
          "https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png",
        ].map((src, idx) => (
          <div key={idx} className="relative overflow-hidden">
            <Image
              src={src}
              alt="ACCTIVE product"
              fill
              className="object-cover object-center opacity-60"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent dark:from-ink-950 dark:via-ink-950/10" />
          </div>
        ))}
      </div>

      {/* ── Contact content ─────────────────────────────── */}
      <div className="container-x py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Info + map */}
          <div className="space-y-4 lg:col-span-1">
            <InfoRow label="Factory Address" value={fullAddress} />
            <div className="card p-5">
              <p className="text-sm font-semibold">Phone</p>
              {site.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/\s/g, "")}`}
                  className="mt-1 block text-sm text-ink-600 hover:text-flame-500 dark:text-ink-300"
                >
                  {p}
                </a>
              ))}
            </div>
            <div className="card p-5">
              <p className="text-sm font-semibold">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-1 block text-sm text-ink-600 hover:text-flame-500 dark:text-ink-300"
              >
                {site.email}
              </a>
            </div>
            <div className="card p-5">
              <p className="text-sm font-semibold">Social</p>
              <div className="mt-3 flex gap-3">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 rounded-xl bg-green-500/10 px-3 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-500 hover:text-white"
                >
                  WhatsApp
                </a>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 rounded-xl bg-pink-500/10 px-3 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-500 hover:text-white"
                >
                  Instagram
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-ink-100 dark:border-ink-800">
              <iframe
                title="ACCTIVE Sports location"
                src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-56 w-full"
                loading="lazy"
              />
            </div>

            {/* Product teaser */}
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png"
                alt="ACCTIVE sportswear"
                width={400}
                height={220}
                className="h-44 w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-bold text-white">
                  300+ customizable designs
                </p>
                <p className="text-xs text-ink-300">Factory-direct · Pan-India delivery</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{value}</p>
    </div>
  );
}
