"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { formatINR } from "@/lib/utils";
import { cartTotals, unitPrice } from "@/lib/pricing";
import { whatsappLink, payments, hasUpi, hasBankDetails, DISCOUNTS } from "@/lib/site";
import { Icon, type IconName } from "@/components/ui/Icon";

type PaymentMethod = "upi" | "bank_transfer" | "cod" | "razorpay";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: IconName; desc: string }[] = [
  {
    id: "upi",
    label: "UPI",
    icon: "smartphone",
    desc: "Google Pay · PhonePe · Paytm · BHIM",
  },
  {
    id: "razorpay",
    label: "Debit / Credit Card",
    icon: "creditCard",
    desc: "Visa · Mastercard · RuPay · Net Banking",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    icon: "building",
    desc: "NEFT · RTGS · IMPS",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    icon: "banknote",
    desc: "Pay in cash when your order arrives",
  },
];

export default function CheckoutPage() {
  const { items, totalPieces, clear } = useCart();
  const { customer, isLoggedIn, isLoading, login } = useCustomer();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [hpUrl, setHpUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState("");

  // Auto-fill from customer profile when they log in
  useEffect(() => {
    if (customer) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || customer.name,
        phone: prev.phone || customer.phone,
        email: prev.email || customer.email || "",
      }));
    }
  }, [customer]);

  // Same engine the cart and the server use, so the figure confirmed here is
  // the figure recorded against the order.
  const totals = cartTotals(items);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Guard against a double submit: the button is disabled while sending, but
    // Enter in a text field can still fire the form again before React
    // re-renders, which would create two orders.
    if (status === "sending") return;
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
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800">
            <Icon name="cart" size={38} />
          </div>
          <h1 className="mt-8 text-3xl font-extrabold">Nothing to checkout</h1>
          <p className="mt-3 text-ink-500 dark:text-ink-400">
            Your cart is empty. Add some products before checking out.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/catalogue" className="btn-primary">Browse catalogue</Link>
            <Link href="/cart" className="btn-secondary">View cart</Link>
          </div>
        </div>
      </div>
    );
  }

  // Login gate — show a premium login prompt if not authenticated
  if (!isLoggedIn && status !== "done") {
    return (
      <div className="container-x py-24 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-flame-500/10 text-flame-500">
            <Icon name="shieldCheck" size={38} />
          </div>
          <h1 className="mt-8 text-3xl font-extrabold">
            {isLoading ? "Checking session…" : "Login to checkout"}
          </h1>
          <p className="mt-3 text-ink-500 dark:text-ink-400">
            Verify your identity with a quick OTP before placing your order.
            This keeps your account secure and ensures a genuine purchase.
          </p>
          {!isLoading && (
            <button
              onClick={login}
              className="btn-primary mt-8 mx-auto"
            >
              <Icon name="phone" size={18} />
              Verify with OTP
            </button>
          )}
          {isLoading && (
            <div className="mt-8 flex justify-center">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink-300 border-t-flame-500" />
            </div>
          )}
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
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
            <Icon name="check" size={38} strokeWidth={2.5} />
          </div>
          <h1 className="mt-8 text-4xl font-extrabold text-green-600 dark:text-green-400">
            Order placed
          </h1>
          {orderId && (
            <p className="nums mt-2 font-mono text-sm font-bold uppercase tracking-widest text-ink-500">
              #{shortId}
            </p>
          )}
          <p className="mt-5 leading-relaxed text-ink-600 dark:text-ink-300">
            Thank you. Our team will review and confirm your order within 24 hours.
          </p>

          {/* Payment instructions */}
          <div className="mt-8 rounded-2xl border border-ink-100 bg-ink-50 p-6 text-left dark:border-ink-800 dark:bg-ink-900">
            <p className="mb-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-700 dark:text-ink-300">
              {payInfo && <Icon name={payInfo.icon} size={16} />}
              Payment instructions — {payInfo?.label}
            </p>

            {paymentMethod === "upi" && (
              <div className="space-y-3 text-sm">
                {hasUpi ? (
                  <>
                    <p className="text-ink-600 dark:text-ink-400">
                      After order confirmation, pay via any UPI app:
                    </p>
                    <div className="flex items-center justify-between rounded-xl bg-white p-4 dark:bg-ink-800">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">UPI ID</p>
                        <p className="mt-1 font-mono text-base font-bold text-flame-500">{payments.upiId}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(payments.upiId)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-200"
                      >
                        <Icon name="copy" size={13} />
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-ink-400">Use order #{shortId} as the payment note.</p>
                  </>
                ) : (
                  <PaymentPending shortId={shortId} />
                )}
              </div>
            )}

            {paymentMethod === "bank_transfer" && (
              <div className="space-y-2 text-sm">
                {hasBankDetails ? (
                  <>
                    <p className="text-ink-600 dark:text-ink-400">
                      Transfer to the following account after confirmation:
                    </p>
                    <div className="space-y-2 rounded-xl bg-white p-4 dark:bg-ink-800">
                      {[
                        ["Account name", payments.bank.name],
                        ["Account no.", payments.bank.account],
                        ["IFSC code", payments.bank.ifsc],
                        ["Bank", payments.bank.bankName],
                      ]
                        .filter(([, val]) => val)
                        .map(([label, val]) => (
                          <div key={label} className="flex items-center justify-between gap-4">
                            <span className="text-xs text-ink-400">{label}</span>
                            <span className="font-mono font-semibold">{val}</span>
                          </div>
                        ))}
                    </div>
                    <p className="text-xs text-ink-400">Use order #{shortId} as the transfer reference.</p>
                  </>
                ) : (
                  <PaymentPending shortId={shortId} />
                )}
              </div>
            )}

            {paymentMethod === "razorpay" && (
              <div className="space-y-2 text-sm text-ink-600 dark:text-ink-400">
                <p>
                  Our team will send you a secure payment link by WhatsApp or email once your
                  order is confirmed.
                </p>
                <p className="text-xs text-ink-400">
                  Accepted: Visa · Mastercard · RuPay · Net Banking · UPI
                </p>
              </div>
            )}

            {paymentMethod === "cod" && (
              <p className="text-sm text-ink-600 dark:text-ink-400">
                Pay in cash when your order is delivered. Our team will confirm whether cash on
                delivery is available for your location.
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/catalogue" className="btn-primary">Continue shopping</Link>
            <a
              href={whatsappLink(
                `Hi, I just placed order #${shortId} on ACCTIVE Sports. Can you confirm?`
              )}
              target="_blank"
              rel="noopener"
              className="btn-secondary text-[#25D366]"
            >
              <Icon name="whatsapp" size={16} />
              Follow up on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-14">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        Fill in your details and we&apos;ll confirm your order within 24 hours.
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
              <h2 className="text-xl font-bold">Contact details</h2>
              <p className="mt-1 text-sm text-ink-500">
                We&apos;ll use this to confirm your order and send updates.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="ch-name">Full name *</label>
                <input id="ch-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Your full name" />
              </div>
              <div>
                <label className="label" htmlFor="ch-company">Team / company</label>
                <input id="ch-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" placeholder="Optional" />
              </div>
              <div>
                <label className="label" htmlFor="ch-email">Email address *</label>
                <input id="ch-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="you@example.com" />
              </div>
              <div>
                <label className="label" htmlFor="ch-phone">Phone / WhatsApp *</label>
                <input id="ch-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+91 99999 00000" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="ch-message">Special instructions</label>
              <textarea id="ch-message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" placeholder="Colour preferences, logo placement, delivery deadline, branding notes…" />
            </div>
          </div>

          {/* Payment method */}
          <div className="card space-y-4 p-6">
            <div>
              <h2 className="text-xl font-bold">Payment method</h2>
              <p className="mt-1 text-sm text-ink-500">Payment is collected after order confirmation.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_OPTIONS.map((opt) => {
                const selected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    aria-pressed={selected}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors duration-150 ${
                      selected
                        ? "border-flame-500 bg-flame-500/5"
                        : "border-ink-200 hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 transition ${
                        selected ? "border-flame-500 bg-flame-500" : "border-ink-300 dark:border-ink-600"
                      }`}
                    >
                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={selected ? "text-flame-500" : "text-ink-400"}>
                          <Icon name={opt.icon} size={16} />
                        </span>
                        <span className="text-sm font-bold text-ink-900 dark:text-white">{opt.label}</span>
                      </div>
                      <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Inline hints — only ever show details that are actually configured */}
            {paymentMethod === "upi" && hasUpi && (
              <div className="flex items-center gap-3 rounded-xl border border-flame-500/20 bg-flame-500/5 px-4 py-3">
                <span className="text-flame-500"><Icon name="smartphone" size={18} /></span>
                <div className="text-xs">
                  <p className="font-semibold text-ink-800 dark:text-white">
                    UPI ID: <span className="font-mono text-flame-500">{payments.upiId}</span>
                  </p>
                  <p className="mt-0.5 text-ink-500">Accepted: Google Pay · PhonePe · Paytm · BHIM</p>
                </div>
              </div>
            )}
            {paymentMethod === "bank_transfer" && hasBankDetails && (
              <div className="space-y-1 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-xs dark:border-ink-700 dark:bg-ink-800/50">
                <p className="font-semibold text-ink-800 dark:text-white">
                  Bank details (pay after confirmation)
                </p>
                <p className="text-ink-500">
                  Account: <span className="font-mono">{payments.bank.account}</span> · IFSC:{" "}
                  <span className="font-mono">{payments.bank.ifsc}</span>
                </p>
                {payments.bank.bankName && (
                  <p className="text-ink-500">{payments.bank.bankName} — {payments.bank.name}</p>
                )}
              </div>
            )}
            {paymentMethod === "razorpay" && (
              <div className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-xs">
                <span className="text-blue-500"><Icon name="creditCard" size={18} /></span>
                <p className="text-ink-600 dark:text-ink-400">
                  A secure payment link will be sent after order confirmation.
                </p>
              </div>
            )}
            {paymentMethod === "cod" && (
              <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-xs">
                <span className="text-green-600"><Icon name="banknote" size={18} /></span>
                <p className="text-ink-600 dark:text-ink-400">
                  Pay in cash on delivery. Subject to availability in your location.
                </p>
              </div>
            )}
          </div>

          {/* Error */}
          {status === "error" && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
            >
              <span className="mt-0.5 shrink-0"><Icon name="alert" size={16} /></span>
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary w-full justify-center py-4 text-base font-bold disabled:opacity-60"
          >
            {status === "sending" ? (
              <>
                <Icon name="spark" size={16} className="animate-spin" />
                Placing order…
              </>
            ) : (
              <>
                Place order
                <Icon name="arrowRight" size={17} />
              </>
            )}
          </button>
          <p className="text-center text-xs text-ink-400">
            Payment is processed only after order confirmation from our team.
          </p>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="card sticky top-24 overflow-hidden">
            <div className="border-b border-ink-100 bg-ink-50 px-5 py-4 dark:border-ink-800 dark:bg-ink-800/40">
              <h2 className="text-lg font-bold">Your order</h2>
              <p className="nums mt-0.5 text-xs text-ink-500">
                {items.length} item{items.length !== 1 ? "s" : ""} · {totalPieces} piece
                {totalPieces !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="max-h-80 divide-y divide-ink-100 overflow-y-auto dark:divide-ink-800">
              {items.map((item) => {
                const unit = unitPrice(item.price, totalPieces);
                return (
                  <div key={item.cartKey} className="flex gap-3 px-5 py-3.5">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100 dark:bg-ink-800">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold">{item.name}</p>
                      <p className="nums mt-0.5 text-xs text-ink-500">
                        {[item.size, item.fabric].filter(Boolean).join(" · ")} · Qty {item.qty}
                      </p>
                      {unit != null && (
                        <p className="nums mt-1 text-sm font-bold text-ink-900 dark:text-white">
                          {formatINR(unit * item.qty)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-ink-100 px-5 py-4 dark:border-ink-800">
              {totals.hasPrice ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-ink-500 dark:text-ink-400">
                    <span>Subtotal (MRP)</span>
                    <span className="nums line-through">{formatINR(totals.mrpSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>{totals.label} &minus;{totals.pct}%</span>
                    <span className="nums font-semibold">&minus;{formatINR(totals.savings)}</span>
                  </div>
                  <div className="my-2 rule-fade" />
                  <div className="flex items-baseline justify-between font-bold text-ink-900 dark:text-white">
                    <span>Total</span>
                    <span className="nums text-xl">{formatINR(totals.subtotal)}</span>
                  </div>
                  {totals.tier === "single" && (
                    <p className="text-[11px] leading-snug text-green-700 dark:text-green-400">
                      Add {totals.piecesToBulk} more piece
                      {totals.piecesToBulk !== 1 ? "s" : ""} to reach {DISCOUNTS.bulk.minQty} and
                      pay {formatINR(totals.bulkSubtotal)} instead.
                    </p>
                  )}
                  <p className="text-[11px] text-ink-400">
                    Shipping and customization charges confirmed on approval.
                  </p>
                </div>
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

/** Shown when the corresponding payment detail has not been configured. */
function PaymentPending({ shortId }: { shortId: string }) {
  return (
    <p className="text-ink-600 dark:text-ink-400">
      Our team will send you the payment details along with your order confirmation. Quote order
      #{shortId} when you pay.
    </p>
  );
}
