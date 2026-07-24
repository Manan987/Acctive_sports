import Link from "next/link";
import { site, fullAddress, whatsappLink } from "@/lib/site";

export function Footer() {
  const year = 2026;
  return (
    <footer className="mt-20 border-t border-ink-100 bg-ink-50 dark:border-ink-800 dark:bg-ink-950">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-flame-500 font-display text-lg font-black text-white">
              A
            </span>
            <span className="font-display text-lg font-extrabold">ACCTIVE</span>
          </div>
          <p className="mt-4 text-sm text-ink-500 dark:text-ink-400">
            {site.tagline}. Vibrant sublimation, premium fabrics, custom designs and
            bulk orders with pan-India delivery.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-500 dark:text-ink-400">
            <li><Link href="/catalogue" className="hover:text-flame-500">Catalogue</Link></li>
            <li><Link href="/about" className="hover:text-flame-500">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-flame-500">Contact</Link></li>
            <li><Link href="/quote" className="hover:text-flame-500">Request a Quote</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white">Products</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-500 dark:text-ink-400">
            <li><Link href="/catalogue?category=collar-t-shirts" className="hover:text-flame-500">Collar T-Shirts</Link></li>
            <li><Link href="/catalogue?category=round-neck-t-shirts" className="hover:text-flame-500">Round Neck T-Shirts</Link></li>
            <li><Link href="/catalogue?category=shorts" className="hover:text-flame-500">Shorts</Link></li>
            <li><Link href="/catalogue?category=lowers" className="hover:text-flame-500">Lowers</Link></li>
            <li><Link href="/catalogue?category=tracksuits" className="hover:text-flame-500">Tracksuits</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white">Get in touch</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-500 dark:text-ink-400">
            <li>{fullAddress}</li>
            {site.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-flame-500">{p}</a>
              </li>
            ))}
            <li><a href={`mailto:${site.email}`} className="hover:text-flame-500">{site.email}</a></li>
            <li className="flex gap-3 pt-1">
              <a href={whatsappLink("Hi ACCTIVE, I'd like to enquire about your sportswear.")} target="_blank" rel="noopener" className="hover:text-flame-500">WhatsApp</a>
              <a href={site.instagram} target="_blank" rel="noopener" className="hover:text-flame-500">Instagram</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-100 dark:border-ink-800">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-ink-500 dark:text-ink-400 sm:flex-row">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p>Made in Meerut, India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
