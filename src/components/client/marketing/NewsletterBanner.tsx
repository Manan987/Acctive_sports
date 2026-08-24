"use client";

import { useState } from "react";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // In production this would hit an API — for now we show success
    setStatus("done");
    setEmail("");
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-50 via-white to-flame-50 dark:border-ink-800 dark:from-ink-900 dark:via-ink-900 dark:to-flame-950/30">
      {/* Decorative orbs */}
      <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-flame-500/10 blur-[80px]" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-electric-500/10 blur-[60px]" />

      <div className="relative px-6 py-10 text-center sm:px-10 md:py-14">
        <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/20 bg-flame-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-flame-600 dark:text-flame-400">
          🔥 Exclusive Offer
        </span>
        <h2 className="mt-4 font-display text-2xl font-extrabold text-ink-900 dark:text-white sm:text-3xl">
          Get <span className="gradient-text">10% off</span> your first bulk order
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-ink-500 dark:text-ink-400">
          Drop your email and we&apos;ll send you an exclusive discount code, plus early access to new designs and seasonal collections.
        </p>

        {status === "done" ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-6 py-3 text-sm font-bold text-green-600 dark:text-green-400 animate-check-pop">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            You&apos;re on the list! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md gap-2">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input flex-1 input-focus-glow"
            />
            <button type="submit" className="btn-primary shrink-0 whitespace-nowrap">
              Get 10% Off
            </button>
          </form>
        )}

        <p className="mt-3 text-[11px] text-ink-400 dark:text-ink-500">
          No spam, ever. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </div>
  );
}
