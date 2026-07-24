"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
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
        body: JSON.stringify({ ...form, source: "contact", items: [] }),
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
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-500/10 text-2xl">✓</div>
        <h3 className="mt-4 font-display text-xl font-bold">Message sent!</h3>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
          Thanks for reaching out — we&apos;ll get back to you soon.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-secondary mt-5">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">Name *</label>
          <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="c-company">Team / Company</label>
          <input id="c-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="c-email">Email *</label>
          <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="c-phone">Phone / WhatsApp *</label>
          <input id="c-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-message">Message *</label>
        <textarea id="c-message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" placeholder="Tell us what you need — products, quantities, timeline…" />
      </div>
      {status === "error" && <p className="text-sm text-red-500">{errorMsg}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={status === "sending"} className="btn-primary">
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-secondary text-[#25D366]">
          Or WhatsApp us
        </a>
      </div>
    </form>
  );
}
