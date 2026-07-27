"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatINR } from "@/lib/utils";

type Item = {
  name: string;
  qty: number;
  size?: string;
  fabric?: string;
  note?: string;
  price?: number | null;
  lineTotal?: number | null;
};
type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  message: string | null;
  status: string;
  source: string;
  paymentMethod: string | null;
  total: number | null;
  items: Item[];
  createdAt: string;
};

const PAYMENT_LABEL: Record<string, string> = {
  upi: "📲 UPI",
  bank_transfer: "🏦 Bank Transfer",
  cod: "💵 Cash on Delivery",
  razorpay: "💳 Card / Net Banking",
};

const STATUSES = ["NEW", "IN_PROGRESS", "QUOTED", "CLOSED"] as const;
const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-flame-500/10 text-flame-500",
  IN_PROGRESS: "bg-amber-500/10 text-amber-600",
  QUOTED: "bg-electric-500/10 text-electric-600",
  CLOSED: "bg-green-500/10 text-green-600",
};
const SOURCE_COLOR: Record<string, string> = {
  cart: "bg-violet-500/10 text-violet-600",
  quote: "bg-amber-500/10 text-amber-600",
  contact: "bg-sky-500/10 text-sky-600",
};

export function EnquiryList({ enquiries }: { enquiries: Enquiry[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

  const shown = filter === "ALL" ? enquiries : enquiries.filter((e) => e.status === filter);

  async function setStatus(id: string, status: string) {
    await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              filter === s ? "border-flame-500 bg-flame-500 text-white" : "border-ink-200 dark:border-ink-700"
            }`}
          >
            {s === "ALL" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="card p-8 text-center text-ink-500">No enquiries in this view.</p>
      ) : (
        <div className="space-y-3">
          {shown.map((e) => {
            const open = openId === e.id;
            const totalPcs = e.items.reduce((n, i) => n + (i.qty || 0), 0);
            return (
              <div key={e.id} className="card overflow-hidden">
                <button onClick={() => setOpenId(open ? null : e.id)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{e.name}</span>
                      <span className={`badge ${STATUS_COLOR[e.status] || ""}`}>{e.status.replace("_", " ")}</span>
                      <span className={`badge ${SOURCE_COLOR[e.source] || "badge"}`}>{e.source}</span>
                      {e.paymentMethod && (
                        <span className="badge bg-emerald-500/10 text-emerald-600">
                          {PAYMENT_LABEL[e.paymentMethod] ?? e.paymentMethod}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-ink-500">
                      {e.email} · {e.phone}
                      {e.items.length > 0 && ` · ${e.items.length} items / ${totalPcs} pcs`}
                      {e.total != null && ` · ${formatINR(e.total)}`}
                    </p>
                  </div>
                  <span className="text-ink-400">{open ? "▲" : "▼"}</span>
                </button>

                {open && (
                  <div className="border-t border-ink-100 p-4 dark:border-ink-800">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1 text-sm">
                        {e.company && <p><span className="text-ink-400">Company:</span> {e.company}</p>}
                        <p><span className="text-ink-400">Email:</span> <a href={`mailto:${e.email}`} className="text-flame-500">{e.email}</a></p>
                        <p><span className="text-ink-400">Phone:</span> <a href={`tel:${e.phone}`} className="text-flame-500">{e.phone}</a></p>
                        <p><span className="text-ink-400">Received:</span> {new Date(e.createdAt).toLocaleString("en-IN")}</p>
                        {e.message && <p className="pt-1"><span className="text-ink-400">Message:</span> {e.message}</p>}
                      </div>
                      <div>
                        <a
                          href={`https://wa.me/${e.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener"
                          className="btn-secondary text-[#25D366]"
                        >
                          Reply on WhatsApp
                        </a>
                      </div>
                    </div>

                    {e.items.length > 0 && (
                      <div className="mt-4 overflow-x-auto rounded-xl border border-ink-100 dark:border-ink-800">
                        <table className="w-full text-sm">
                          <thead className="bg-ink-50 text-left text-xs uppercase text-ink-500 dark:bg-ink-950">
                            <tr><th className="p-2">Product</th><th className="p-2">Qty</th><th className="p-2">Size</th><th className="p-2">Fabric</th><th className="p-2">Price</th><th className="p-2">Line total</th><th className="p-2">Note</th></tr>
                          </thead>
                          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                            {e.items.map((it, i) => (
                              <tr key={i}>
                                <td className="p-2">{it.name}</td>
                                <td className="p-2">{it.qty}</td>
                                <td className="p-2">{it.size || "—"}</td>
                                <td className="p-2">{it.fabric || "—"}</td>
                                <td className="p-2">{it.price != null ? formatINR(it.price) : "On request"}</td>
                                <td className="p-2 font-semibold">{it.lineTotal != null ? formatINR(it.lineTotal) : "—"}</td>
                                <td className="p-2 text-ink-500">{it.note || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                          {e.total != null && (
                            <tfoot className="border-t border-ink-200 dark:border-ink-700">
                              <tr>
                                <td className="p-2 font-semibold" colSpan={5}>Order total</td>
                                <td className="p-2 font-bold" colSpan={2}>{formatINR(e.total)}</td>
                              </tr>
                            </tfoot>
                          )}
                        </table>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-ink-400">Status:</span>
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(e.id, s)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            e.status === s ? "bg-flame-500 text-white" : "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300"
                          }`}
                        >
                          {s.replace("_", " ")}
                        </button>
                      ))}
                      <button onClick={() => remove(e.id)} className="ml-auto text-sm text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
