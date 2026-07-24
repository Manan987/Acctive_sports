"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="font-display text-6xl font-black text-flame-500">Oops</p>
        <h1 className="mt-4 font-display text-2xl font-extrabold">Something went wrong</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          We hit an unexpected error. Please try again or head back home.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={reset} className="btn-primary">Try again</button>
          <Link href="/" className="btn-secondary">Go home</Link>
        </div>
      </div>
    </div>
  );
}
