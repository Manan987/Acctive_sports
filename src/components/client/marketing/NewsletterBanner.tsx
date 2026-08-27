"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Signup for new-design and offer alerts.
 *
 * Two things were wrong before. The form never sent the address anywhere — it
 * called `setStatus("done")` and told the visitor "You're on the list!" — and
 * the headline offered "10% off your first bulk order", a third discount that
 * exists nowhere in the pricing engine and that nobody could have honoured.
 * The form now posts to /api/subscribe and the copy promises only what the
 * list actually delivers.
 */
export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending" || !email.trim()) return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not sign you up. Please try again.");
      setStatus("done");
      setMessage(
        data.alreadySubscribed
          ? "You're already on the list — we'll be in touch."
          : "You're on the list. We'll email you when new designs drop."
      );
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Could not sign you up. Please try again.");
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-50 via-white to-flame-50 dark:border-ink-800 dark:from-ink-900 dark:via-ink-900 dark:to-flame-950/30">
      <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-flame-500/10 blur-[80px]" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-electric-500/10 blur-[60px]" />

      <div className="relative px-6 py-12 text-center sm:px-10 md:py-14">
        <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/20 bg-flame-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-flame-600 dark:text-flame-400">
          <Icon name="mail" size={13} />
          New designs first
        </span>
        <h2 className="mt-4 text-2xl font-extrabold text-ink-900 dark:text-white sm:text-3xl">
          Be first to see new designs
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-500 dark:text-ink-400">
          Seasonal collections, new fabrics and factory offers — sent when there is something
          worth sending, and not otherwise.
        </p>

        {status === "done" ? (
          <div className="animate-check-pop mt-6 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-6 py-3 text-sm font-bold text-green-600 dark:text-green-400">
            <Icon name="check" size={18} strokeWidth={2.5} />
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              tabIndex={-1}
              autoComplete="nope"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0, pointerEvents: "none" }}
            />
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input flex-1"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary shrink-0 whitespace-nowrap disabled:opacity-60"
            >
              {status === "sending" ? "Signing up…" : "Notify me"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p role="alert" className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
            {message}
          </p>
        )}

        <p className="mt-4 text-[11px] text-ink-400 dark:text-ink-500">
          No spam. Unsubscribe any time by replying to a mail.
        </p>
      </div>
    </div>
  );
}
