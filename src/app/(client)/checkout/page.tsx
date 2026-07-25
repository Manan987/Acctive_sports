"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";

type PaymentMethod = "upi" | "bank_transfer" | "cod" | "razorpay";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
  {
    id: "upi",
    label: "UPI",
    icon: "📲",
    desc: "Google Pay · PhonePe · Paytm · BHIM",
  },
  {
    id: "razorpay",
    label: "Debit / Credit Card",
    icon: "💳",
    desc: "Visa · Mastercard · RuPay · Net Banking",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    icon: "🏦",
    desc: "NEFT · RTGS · IMPS",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    icon: "💵",
    desc: "Pay in cash when your order arrives",
  },
];

// UPI & bank details — edit these to your actual details
const UPI_ID = "acctivesports@ybl";
const BANK_DETAILS = {
  name: "ACCTIVE Sports Industries",
  account: "1234567890",
  ifsc: "HDFC0001234",
  bank: "HDFC Bank",
};

export default function CheckoutPage() {
  const { items, totalPieces, clear } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [hpUrl, setHpUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState("");

  const hasPrice = items.some((i) => i.price != null);
  const subtotal = items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0);

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
          website: hpUrl,
          source: "cart",
          paymentMethod,
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
      const data = await res.json();
      setOrderId(data.id || "");
      setStatus("done");
      clear();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to place order. Please try WhatsApp.");
    }
  }

  // Empty cart guard
  if (items.length === 0 && status !== "done") {
    return (
      <div className="container-x py-24 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 text-6xl">🛒</div>
          <h1 className="mt-8 font-display text-3xl font-extrabold">Nothing to checkout</h1>
          <p className="mt-3 text-ink-500 dark:text-ink-400">Your cart is empty. Add some products before checking out.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/catalogue" className="btn-primary">Browse Catalogue</Link>
            <Link href="/cart" className="btn-secondary">View Cart</Link>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (status === "done") {
    const shortId = orderId.slice(-8).toUpperCase();
    const payInfo = PAYMENT_OPTIONS.find((p) => p.id === paymentMethod);
    return (
      <div className="container-x py-20">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-green-500/10 text-5xl shadow-xl shadow-green-500/10">✓</div>
          <h1 className="mt-8 font-display text-4xl font-extrabold text-green-600 dark:text-green-400">Order Placed!</h1>
          {orderId && (
            <p className="mt-2 font-mono text-sm font-bold uppercase tracking-widest text-ink-500">
              #{shortId}
            </p>
          )}
          <p className="mt-5 leading-relaxed text-ink-600 dark:text-ink-300">
            Thank you! Our team will review and confirm your order within 24 hours.
          </p>

          {/* Payment Instructions */}
          <div className="mt-8 rounded-2xl border border-ink-100 bg-ink-50 p-6 text-left dark:border-ink-800 dark:bg-ink-900">
            <p className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-ink-700 dark:text-ink-300">
              {payInfo?.icon} Payment Instructions — {payInfo?.label}
            </p>
            {paymentMethod === "upi" && (
              <div className="space-y-3 text-sm">
                <p className="text-ink-600 dark:text-ink-400">
                  After order confirmation, pay via any UPI app:
                </p>
                <div className="flex items-center justify-between rounded-xl bg-white p-4 dark:bg-ink-800">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">UPI ID</p>
                    <p className="mt-1 font-mono text-base font-bold text-flame-500">{UPI_ID}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(UPI_ID)}
                    className="rounded-lg bg-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-200"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-ink-400">Use order #{shortId} as the payment note.</p>
              </div>
            )}
            {paymentMethod === "bank_transfer" && (
              <div className="space-y-2 text-sm">
                <p className="text-ink-600 dark:text-ink-400">Transfer to the following account after confirmation:</p>
                <div className="rounded-xl bg-white p-4 dark:bg-ink-800 space-y-2">
                  {[
                    ["Account Name", BANK_DETAILS.name],
                    ["Account No.", BANK_DETAILS.account],
                    ["IFSC Code", BANK_DETAILS.ifsc],
                    ["Bank", BANK_DETAILS.bank],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-ink-400">{label}</span>
                      <span className="font-mono font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-400">Use order #{shortId} as the transfer reference.</p>
              </div>
            )}
            {paymentMethod === "razorpay" && (
              <div className="space-y-2 text-sm text-ink-600 dark:text-ink-400">
                <p>Our team will send you a secure payment link via WhatsApp / email after confirming your order.</p>
                <p className="text-xs text-ink-400">Accepted: Visa · Mastercard · RuPay · Net Banking · UPI</p>
              </div>
            )}
            {paymentMethod === "cod" && (
              <div className="text-sm text-ink-600 dark:text-ink-400 space-y-2">
                <p>Pay in cash when your order is delivered. Our team will confirm availability of COD for your location.</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/catalogue" className="btn-primary">Continue Shopping</Link>
            <a
              href={whatsappLink(`Hi, I just placed order #${shortId} on ACCTIVE Sports. Can you confirm?`)}
              target="_blank"
              rel="noopener"
              className="btn-secondary text-[#25D366]"
            >
              Follow up on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-14">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        Fill in your details and we'll confirm your order within 24 hours.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        {/* Form */}
        <form onSubmit={submit} className="space-y-6 lg:col-span-3">
          {/* Honeypot */}
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

          {/* Contact details */}
          <div className="card space-y-5 p-6">
            <div>
              <h2 className="font-display text-xl font-bold">Contact Details</h2>
              <p className="mt-1 text-sm text-ink-500">We'll use this to confirm your order and send updates.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="ch-name">Full Name *</label>
                <input id="ch-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Your full name" />
              </div>
              <div>
                <label className="label" htmlFor="ch-company">Team / Company</label>
                <input id="ch-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" placeholder="Optional" />
              </div>
              <div>
                <label className="label" htmlFor="ch-email">Email Address *</label>
                <input id="ch-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="you@example.com" />
              </div>
              <div>
                <label className="label" htmlFor="ch-phone">Phone / WhatsApp *</label>
                <input id="ch-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+91 99999 00000" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="ch-message">Special Instructions</label>
              <textarea id="ch-message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" placeholder="Colour preferences, logo placement, delivery deadline, branding notes…" />
            </div>
          </div>

          {/* Payment method */}
          <div className="card p-6 space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold">Payment Method</h2>
              <p className="mt-1 text-sm text-ink-500">Payment is collected after order confirmation.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-150 ${
                    paymentMethod === opt.id
                      ? "border-flame-500 bg-flame-500/5"
                      : "border-ink-200 hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600"
                  }`}
                >
                  {/* Radio dot */}
                  <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 transition ${paymentMethod === opt.id ? "border-flame-500 bg-flame-500" : "border-ink-300 dark:border-ink-600"}`}>
                    {paymentMethod === opt.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base leading-none">{opt.icon}</span>
                      <span className="text-sm font-bold text-ink-900 dark:text-white">{opt.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Inline UPI hint */}
            {paymentMethod === "upi" && (
              <div className="flex items-center gap-3 rounded-xl bg-flame-500/5 border border-flame-500/20 px-4 py-3">
                <span className="text-xl">📲</span>
                <div className="text-xs">
                  <p className="font-semibold text-ink-800 dark:text-white">UPI ID: <span className="font-mono text-flame-500">{UPI_ID}</span></p>
                  <p className="text-ink-500 mt-0.5">Accepted: Google Pay · PhonePe · Paytm · BHIM</p>
                </div>
              </div>
            )}
            {paymentMethod === "bank_transfer" && (
              <div className="rounded-xl bg-ink-50 border border-ink-200 px-4 py-3 dark:bg-ink-800/50 dark:border-ink-700 text-xs space-y-1">
                <p className="font-semibold text-ink-800 dark:text-white">Bank Details (pay after confirmation)</p>
                <p className="text-ink-500">Account: <span className="font-mono">{BANK_DETAILS.account}</span> · IFSC: <span className="font-mono">{BANK_DETAILS.ifsc}</span></p>
                <p className="text-ink-500">{BANK_DETAILS.bank} — {BANK_DETAILS.name}</p>
              </div>
            )}
            {paymentMethod === "razorpay" && (
              <div className="flex items-center gap-3 rounded-xl bg-blue-500/5 border border-blue-500/20 px-4 py-3 text-xs">
                <span className="text-xl">💳</span>
                <p className="text-ink-600 dark:text-ink-400">A secure Razorpay payment link will be sent after order confirmation.</p>
              </div>
            )}
            {paymentMethod === "cod" && (
              <div className="flex items-center gap-3 rounded-xl bg-green-500/5 border border-green-500/20 px-4 py-3 text-xs">
                <span className="text-xl">💵</span>
                <p className="text-ink-600 dark:text-ink-400">Pay in cash on delivery. Subject to location availability.</p>
              </div>
            )}
          </div>

          {/* Error */}
          {status === "error" && (
            <div className="flex items-start gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={status === "sending"} className="btn-primary w-full justify-center py-4 text-base font-bold disabled:opacity-60">
            {status === "sending" ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Placing Order…
              </span>
            ) : "Place Order →"}
          </button>
          <p className="text-center text-xs text-ink-400">
            Payment is processed only after order confirmation from our team.
          </p>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="card sticky top-20 overflow-hidden">
            <div className="border-b border-ink-100 bg-ink-50 px-5 py-4 dark:border-ink-800 dark:bg-ink-800/40">
              <h2 className="font-display text-lg font-bold">Your Order</h2>
              <p className="mt-0.5 text-xs text-ink-500">
                {items.length} item{items.length !== 1 ? "s" : ""} · {totalPieces} piece{totalPieces !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="max-h-80 divide-y divide-ink-100 overflow-y-auto dark:divide-ink-800">
              {items.map((item) => (
                <div key={item.cartKey} className="flex gap-3 px-5 py-3.5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100 dark:bg-ink-800">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold">{item.name}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{[item.size, item.fabric].filter(Boolean).join(" · ")} · Qty: {item.qty}</p>
                    {item.price != null && <p className="mt-1 text-sm font-bold text-ink-900 dark:text-white">{formatINR(item.price * item.qty)}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-ink-100 px-5 py-4 dark:border-ink-800">
              {hasPrice ? (
                <>
                  <div className="flex items-center justify-between font-bold text-ink-900 dark:text-white">
                    <span>Subtotal</span>
                    <span className="font-display text-xl">{formatINR(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-ink-400">Final price confirmed on approval.</p>
                </>
              ) : (
                <p className="rounded-xl bg-flame-500/10 px-3 py-2 text-xs font-medium text-flame-600 dark:text-flame-400">
                  Pricing confirmed on order approval.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
