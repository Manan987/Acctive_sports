"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuote } from "@/context/QuoteContext";
import { whatsappLink } from "@/lib/site";

export default function QuotePage() {
  const { items, update, remove, clear } = useQuote();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const totalPieces = items.reduce((n, i) => n + i.qty, 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website,
          source: "quote",
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            slug: i.slug,
            qty: i.qty,
            size: i.size,
            fabric: i.fabric,
            note: i.note,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("done");
      clear();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to submit. Please try WhatsApp.");
    }
  }

  if (status === "done") {
    return (
      <div className="container-x py-24 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/10 text-3xl">✓</div>
          <h1 className="mt-6 font-display text-2xl font-extrabold">Quote request sent!</h1>
          <p className="mt-2 text-ink-500 dark:text-ink-400">
            Thanks — our team will review your request and get back to you shortly with a
            custom quote. For anything urgent, message us on WhatsApp.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/catalogue" className="btn-primary">Browse more</Link>
            <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-secondary">WhatsApp us</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-14">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Your Quote Request</h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        Add products, set quantities and sizes, then send us your details for a custom bulk quote.
      </p>

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-ink-200 py-16 text-center dark:border-ink-700">
          <p className="text-lg font-semibold">Your quote list is empty.</p>
          <p className="mt-1 text-ink-500 dark:text-ink-400">
            Browse the catalogue and add designs to build your request.
          </p>
          <Link href="/catalogue" className="btn-primary mt-6">Browse Catalogue</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={item.productId} className="card flex gap-4 p-4">
                <Link href={`/products/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-100 dark:bg-ink-800">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-flame-500">
                      {item.name}
                    </Link>
                    <button
                      onClick={() => remove(item.productId)}
                      className="text-ink-400 hover:text-red-500"
                      aria-label="Remove"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <label className="text-xs text-ink-500">
                      Qty
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => update(item.productId, { qty: Math.max(1, Number(e.target.value) || 1) })}
                        className="input mt-1 w-24 py-1.5"
                      />
                    </label>
                    <label className="text-xs text-ink-500">
                      Size
                      <input
                        value={item.size}
                        onChange={(e) => update(item.productId, { size: e.target.value })}
                        className="input mt-1 w-20 py-1.5"
                      />
                    </label>
                    <label className="text-xs text-ink-500">
                      Fabric
                      <input
                        value={item.fabric}
                        onChange={(e) => update(item.productId, { fabric: e.target.value })}
                        className="input mt-1 w-32 py-1.5"
                      />
                    </label>
                  </div>
                  {item.note && (
                    <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">Note: {item.note}</p>
                  )}
                </div>
              </div>
            ))}
            <button onClick={clear} className="btn-ghost text-sm text-red-500">Clear all</button>
          </div>

          {/* Contact form */}
          <div>
            <form onSubmit={submit} className="card sticky top-20 space-y-3 p-6">
              {/* Honeypot — hidden from real users */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">Your details</h2>
                <span className="badge">{items.length} items · {totalPieces} pcs</span>
              </div>
              <div>
                <label className="label" htmlFor="name">Name *</label>
                <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="email">Email *</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone / WhatsApp *</label>
                <input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="company">Team / Company</label>
                <input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="message">Message</label>
                <textarea id="message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" placeholder="Colours, deadline, logo details…" />
              </div>
              {status === "error" && <p className="text-sm text-red-500">{errorMsg}</p>}
              <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
                {status === "sending" ? "Sending…" : "Send quote request"}
              </button>
              <p className="text-center text-xs text-ink-400">
                We&apos;ll reply by email or WhatsApp with a custom quote.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
