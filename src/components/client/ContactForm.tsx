"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [hpUrl, setHpUrl] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: hpUrl, source: "contact", items: [] }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("done");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to send. Please try WhatsApp.");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-8 text-center">
        {/* Animated checkmark */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/10 animate-check-pop">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-ink-900 dark:text-white">Message sent successfully!</h3>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
          Thanks for reaching out — our team will get back to you within 2-4 hours during business hours.
        </p>

        {/* Response time indicator */}
        <div className="mx-auto mt-5 flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 dark:border-ink-800 dark:bg-ink-900 max-w-xs">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-flame-500/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5a0f" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-ink-700 dark:text-ink-200">Estimated response</p>
            <p className="text-xs text-ink-500 dark:text-ink-400">2–4 hours (Mon–Sat, 9 AM – 7 PM)</p>
          </div>
        </div>

        <button onClick={() => setStatus("idle")} className="btn-secondary mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-6 sm:p-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white">
          Send us a message
        </h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Fill out the form below and we&apos;ll respond within 2-4 hours.
        </p>
      </div>

      {/* Honeypot — hidden from real users, do NOT rename to a common field name */}
      <input
        type="text"
        name="hp_url"
        value={hpUrl}
        onChange={(e) => setHpUrl(e.target.value)}
        tabIndex={-1}
        autoComplete="nope"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0, pointerEvents: "none" }}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group">
          <label className="label" htmlFor="c-name">
            Name <span className="text-flame-500">*</span>
          </label>
          <input
            id="c-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input input-focus-glow"
            placeholder="Your full name"
          />
        </div>
        <div className="group">
          <label className="label" htmlFor="c-company">
            Team / Company
          </label>
          <input
            id="c-company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="input input-focus-glow"
            placeholder="e.g. FC United Delhi"
          />
        </div>
        <div className="group">
          <label className="label" htmlFor="c-email">
            Email <span className="text-flame-500">*</span>
          </label>
          <input
            id="c-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input input-focus-glow"
            placeholder="you@example.com"
          />
        </div>
        <div className="group">
          <label className="label" htmlFor="c-phone">
            Phone / WhatsApp <span className="text-flame-500">*</span>
          </label>
          <input
            id="c-phone"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input input-focus-glow"
            placeholder="+91 99971 00375"
          />
        </div>
      </div>

      <div className="group">
        <label className="label" htmlFor="c-message">
          Message <span className="text-flame-500">*</span>
        </label>
        <textarea
          id="c-message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input input-focus-glow resize-none"
          placeholder="Tell us what you need — products, quantities, timeline…"
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {errorMsg}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status === "sending"} className="btn-primary">
          {status === "sending" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9" />
              </svg>
              Send message
            </>
          )}
        </button>
        <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-secondary text-[#25D366]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
          </svg>
          Or WhatsApp us
        </a>

        {/* Response time hint */}
        <span className="text-[11px] text-ink-400 dark:text-ink-500">
          Avg. response: 2–4 hrs
        </span>
      </div>
    </form>
  );
}
