import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="font-display text-7xl font-black text-flame-500">404</p>
        <h1 className="mt-4 font-display text-2xl font-extrabold">Page not found</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-primary">Go home</Link>
          <Link href="/catalogue" className="btn-secondary">Browse catalogue</Link>
        </div>
      </div>
    </div>
  );
}
