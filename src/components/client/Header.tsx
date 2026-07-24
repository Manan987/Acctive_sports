"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useQuote } from "@/context/QuoteContext";
import { SPORTS } from "@/lib/site";

type Cat = { name: string; slug: string; count: number };

export function Header({ categories = [] }: { categories?: Cat[] }) {
  const pathname = usePathname();
  const { count } = useQuote();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMega(false), 120);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition ${
        scrolled || mega
          ? "border-b border-ink-100 bg-white/85 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/85"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-flame-500 font-display text-lg font-black text-white">
            A
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            ACCTIVE<span className="text-flame-500">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/" active={isActive("/")}>Home</NavLink>

          {/* Catalogue with mega menu */}
          <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
            <Link
              href="/catalogue"
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive("/catalogue")
                  ? "bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-white"
                  : "text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
              }`}
              aria-expanded={mega}
            >
              Catalogue
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition ${mega ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Link>

            {mega && (
              <div className="absolute left-1/2 top-full w-[min(56rem,90vw)] -translate-x-1/2 pt-3">
                <div className="grid grid-cols-[1.4fr_1fr] gap-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-2xl dark:border-ink-800 dark:bg-ink-900">
                  <div>
                    <p className="eyebrow mb-3">Categories</p>
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/catalogue?category=${c.slug}`}
                          className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50 hover:text-flame-500 dark:text-ink-200 dark:hover:bg-ink-800"
                        >
                          {c.name}
                          <span className="text-xs text-ink-400 group-hover:text-flame-500">{c.count}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow mb-3">Shop by Sport</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SPORTS.map((s) => (
                        <Link
                          key={s}
                          href={`/catalogue?sport=${encodeURIComponent(s)}`}
                          className="rounded-full border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-600 transition hover:border-flame-500 hover:text-flame-500 dark:border-ink-700 dark:text-ink-300"
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                    <Link href="/quote" className="btn-primary mt-5 w-full text-sm">
                      Request a bulk quote →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink href="/about" active={isActive("/about")}>About</NavLink>
          <NavLink href="/contact" active={isActive("/contact")}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/quote"
            className="relative grid h-9 w-9 place-items-center rounded-full text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            aria-label="Quote request list"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-flame-500 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link href="/quote" className="btn-primary ml-1 hidden sm:inline-flex">
            Get a Quote
          </Link>
          <button
            className="grid h-9 w-9 place-items-center rounded-full text-ink-700 dark:text-ink-200 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="max-h-[70vh] overflow-y-auto border-t border-ink-100 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-950 md:hidden">
          {[
            { href: "/", label: "Home" },
            { href: "/catalogue", label: "Catalogue" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive(item.href)
                  ? "bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-white"
                  : "text-ink-600 dark:text-ink-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {categories.length > 0 && (
            <div className="mt-2 border-t border-ink-100 pt-2 dark:border-ink-800">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Categories</p>
              {categories.map((c) => (
                <Link key={c.slug} href={`/catalogue?category=${c.slug}`} className="block rounded-lg px-3 py-2 text-sm text-ink-600 dark:text-ink-300">
                  {c.name} <span className="text-ink-400">({c.count})</span>
                </Link>
              ))}
            </div>
          )}
          <Link href="/quote" className="btn-primary mt-3 w-full">Get a Quote</Link>
        </nav>
      )}
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-white"
          : "text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
