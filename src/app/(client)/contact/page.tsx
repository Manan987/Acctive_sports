import type { Metadata } from "next";
import { ContactForm } from "@/components/client/ContactForm";
import { site, fullAddress, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with ACCTIVE Sports Industries, Meerut. Call, email or WhatsApp us for custom sportswear quotes and bulk orders.",
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(fullAddress);
  return (
    <div className="container-x py-10 md:py-14">
      <header className="max-w-2xl">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Contact Us</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          Questions, custom designs or bulk enquiries — we&apos;re here to help. Reach out
          and our team will respond quickly.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Info + map */}
        <div className="space-y-4 lg:col-span-1">
          <InfoRow label="Factory Address" value={fullAddress} />
          <div className="card p-5">
            <p className="text-sm font-semibold">Phone</p>
            {site.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="mt-1 block text-sm text-ink-600 hover:text-flame-500 dark:text-ink-300">
                {p}
              </a>
            ))}
          </div>
          <div className="card p-5">
            <p className="text-sm font-semibold">Email</p>
            <a href={`mailto:${site.email}`} className="mt-1 block text-sm text-ink-600 hover:text-flame-500 dark:text-ink-300">
              {site.email}
            </a>
          </div>
          <div className="card p-5">
            <p className="text-sm font-semibold">Social</p>
            <div className="mt-2 flex gap-3 text-sm">
              <a href={whatsappLink()} target="_blank" rel="noopener" className="text-[#25D366] hover:underline">WhatsApp</a>
              <a href={site.instagram} target="_blank" rel="noopener" className="text-flame-500 hover:underline">Instagram</a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-ink-100 dark:border-ink-800">
            <iframe
              title="ACCTIVE Sports location"
              src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-56 w-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <ContactForm />
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
