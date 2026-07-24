"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900 md:h-screen md:w-60 md:border-b-0 md:border-r">
      <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-flame-500 font-display text-lg font-black text-white">A</span>
        <span className="font-display font-extrabold">ACCTIVE Admin</span>
      </Link>
      <nav className="flex gap-1 md:flex-col">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive(l.href, l.exact)
                ? "bg-flame-500 text-white"
                : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto hidden pt-6 md:block">
        <Link href="/" target="_blank" className="block rounded-lg px-3 py-2 text-sm text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800">
          ↗ View site
        </Link>
        <p className="truncate px-3 pt-3 text-xs text-ink-400">{email}</p>
        <button onClick={logout} className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10">
          Sign out
        </button>
      </div>
      <button onClick={logout} className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 md:hidden">
        Sign out
      </button>
    </aside>
  );
}
