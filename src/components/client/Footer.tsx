import Link from "next/link";
import { site, fullAddress, whatsappLink } from "@/lib/site";

export function Footer() {
  const year = 2026;
  return (
    <footer className="relative mt-20 border-t border-ink-100 bg-ink-50 dark:border-ink-800 dark:bg-ink-950">
      {/* Gradient top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame-500 to-transparent" />
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
          <div className="mt-4 flex gap-3">
            <a href={whatsappLink("Hi ACCTIVE, I'd like to enquire about your sportswear.")} target="_blank" rel="noopener"
              className="grid h-9 w-9 place-items-center rounded-full bg-green-500/10 text-green-600 transition hover:bg-green-500 hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href={site.instagram} target="_blank" rel="noopener"
              className="grid h-9 w-9 place-items-center rounded-full bg-pink-500/10 text-pink-600 transition hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-500 dark:text-ink-400">
            <li><Link href="/catalogue" className="hover:text-flame-500">Catalogue</Link></li>
            <li><Link href="/about" className="hover:text-flame-500">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-flame-500">Contact</Link></li>
            <li><Link href="/cart" className="hover:text-flame-500">My Cart</Link></li>
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
