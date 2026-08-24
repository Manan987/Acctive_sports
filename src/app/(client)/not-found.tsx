import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] overflow-hidden">
      {/* Background product image */}
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png"
          alt=""
          fill
          className="object-cover object-center opacity-10 dark:opacity-5"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white dark:from-ink-950 dark:via-ink-950/80 dark:to-ink-950" />
      </div>

      {/* Content */}
      <div className="container-x relative grid min-h-[70vh] place-items-center py-20 text-center">
        <div className="max-w-lg">
          {/* Animated 404 */}
          <div className="relative inline-block">
            <p className="font-display text-[8rem] font-black leading-none text-flame-500/20 sm:text-[10rem]">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-2xl border border-flame-500/20 bg-flame-500/10 px-6 py-3 backdrop-blur-sm">
                <p className="font-display text-xl font-extrabold text-flame-500">
                  Page not found
                </p>
              </div>
            </div>
          </div>

          <h1 className="mt-6 font-display text-2xl font-extrabold text-ink-900 dark:text-white sm:text-3xl">
            Oops! This page doesn&apos;t exist
          </h1>
          <p className="mt-3 text-ink-500 dark:text-ink-400">
            The page you&apos;re looking for may have been moved, deleted, or
            never existed. Let&apos;s get you back on track.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              Go Home
            </Link>
            <Link href="/catalogue" className="btn-secondary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Browse Catalogue
            </Link>
            <Link href="/contact" className="btn-ghost btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Contact Us
            </Link>
          </div>

          {/* Helpful links */}
          <div className="mt-10 rounded-2xl border border-ink-100 bg-ink-50 p-5 dark:border-ink-800 dark:bg-ink-900">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-400">
              Popular pages
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {[
                { href: "/catalogue?category=collar-t-shirts", label: "Collar T-Shirts" },
                { href: "/catalogue?category=round-neck-t-shirts", label: "Round Neck" },
                { href: "/catalogue?category=tracksuits", label: "Tracksuits" },
                { href: "/catalogue?category=shorts", label: "Shorts" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-600 transition hover:border-flame-500 hover:text-flame-500 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
