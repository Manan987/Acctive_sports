"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "@/context/CartContext";
import { SPORTS } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

type Cat = { name: string; slug: string; count: number };

export function Header({ categories = [] }: { categories?: Cat[] }) {
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || mega
          ? "border-b border-ink-100 bg-white/95 shadow-sm backdrop-blur-lg dark:border-ink-800 dark:bg-ink-950/95"
          : "border-b border-white/10 bg-ink-950/40 backdrop-blur-md"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-0" aria-label="ACCTIVE Sports — Home">
          <div className={`overflow-hidden rounded-xl transition-all duration-300 ${
            scrolled || mega
              ? "bg-transparent p-0"
              : "bg-white/10 p-1 backdrop-blur-sm ring-1 ring-white/20"
          }`}>
            <Image
              src="https://res.cloudinary.com/rdhqircc/image/upload/v1787571541/WhatsApp_Image_2026-08-24_at_4.48.59_PM-removebg-preview_gabj92.png"
              alt="ACCTIVE Sports"
              width={220}
              height={72}
              className={`h-16 w-auto object-contain transition-all duration-300 group-hover:scale-[1.04] ${
                scrolled || mega ? "drop-shadow" : "drop-shadow-lg"
              }`}
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/" active={isActive("/")} transparent={!scrolled && !mega}>Home</NavLink>

          {/* Catalogue mega-menu */}
          <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
            <Link
              href="/catalogue"
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive("/catalogue")
                  ? "bg-white/15 text-white backdrop-blur-sm"
                  : scrolled || mega
                  ? "text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
              aria-expanded={mega}
            >
              Shop
              <Icon
                name="chevronDown"
                size={14}
                strokeWidth={2.4}
                className={`transition-transform duration-200 ${mega ? "rotate-180" : ""}`}
              />
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
                    <Link href="/catalogue" className="btn-primary mt-5 w-full text-sm">
                      View all products
                      <Icon name="arrowRight" size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink href="/about" active={isActive("/about")} transparent={!scrolled && !mega}>About</NavLink>
          <NavLink href="/contact" active={isActive("/contact")} transparent={!scrolled && !mega}>Contact</NavLink>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Cart icon button */}
          <button
            onClick={openDrawer}
            className={`relative grid h-9 w-9 place-items-center rounded-full transition ${
              scrolled || mega
                ? "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                : "text-white/80 hover:bg-white/15 hover:text-white"
            }`}
            aria-label={`Cart (${totalItems} items)`}
          >
            <Icon name="cart" size={20} />
            {totalItems > 0 && (
              <span className="nums absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-flame-500 px-1 text-[10px] font-bold text-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* "Shop Now" CTA */}
          <Link
            href="/catalogue"
            className={`ml-1 hidden sm:inline-flex ${
              scrolled || mega
                ? "btn-primary"
                : "btn btn-lg border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 text-sm px-4 py-1.5"
            }`}
          >
            Shop Now
          </Link>

          {/* Mobile hamburger */}
          <button
            className={`grid h-9 w-9 place-items-center rounded-full md:hidden ${
              scrolled || mega ? "text-ink-700 dark:text-ink-200" : "text-white/80"
            }`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} size={22} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="max-h-[70vh] overflow-y-auto border-t border-ink-100 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-950 md:hidden">
          {[
            { href: "/", label: "Home" },
            { href: "/catalogue", label: "Shop" },
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
          <button
            onClick={() => { setOpen(false); openDrawer(); }}
            className="btn-primary mt-3 w-full"
          >
            View Cart ({totalItems})
          </button>
        </nav>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  transparent = false,
  children,
}: {
  href: string;
  active: boolean;
  transparent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? transparent
            ? "bg-white/15 text-white backdrop-blur-sm"
            : "bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-white"
          : transparent
          ? "text-white/80 hover:bg-white/10 hover:text-white"
          : "text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
