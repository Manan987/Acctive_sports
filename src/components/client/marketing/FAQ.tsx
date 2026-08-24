"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What discounts do you offer?",
    a: "We offer 25% off on single piece orders and a massive 50% off on bulk orders of 5+ pieces. Discounts are automatically applied — no coupon needed. The bulk discount is our factory-direct pricing passed straight to you.",
  },
  {
    q: "What is your minimum order quantity (MOQ)?",
    a: "You can order as little as 1 piece — and still get 25% off! For bulk team orders (5+ pieces) you unlock 50% off with factory pricing. Add to cart and the discount is applied automatically.",
  },
  {
    q: "Can I get my team name, numbers and logo printed?",
    a: "Absolutely — every product is fully customizable. Send us your logo, colours and player details and we'll create a free digital mockup for approval before production.",
  },
  {
    q: "Do you provide a sample before the full order?",
    a: "Yes, for bulk orders we can arrange a pre-production sample so you can check fabric, fit and print quality before we manufacture the full quantity.",
  },
  {
    q: "How long does delivery take and where do you ship?",
    a: "We dispatch pan-India from our Meerut factory. Timelines depend on quantity and customization and are shared along with your quote.",
  },
  {
    q: "What fabrics do you offer?",
    a: "Lycra, Superpoly, SAP Mattie, TPU, NS Lycra and Elite Knit — chosen to balance breathability, durability and print quality for each sport.",
  },
  {
    q: "How do I place an order?",
    a: "Simply add products to your cart, select your size, and proceed to checkout. Fill in your details and we'll reply with a custom mockup and final price. For WhatsApp orders, tap the WhatsApp button on any product.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-ink-900 dark:text-white">{f.q}</span>
                <span className={`shrink-0 text-flame-500 transition ${isOpen ? "rotate-45" : ""}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-ink-600 dark:text-ink-300">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
