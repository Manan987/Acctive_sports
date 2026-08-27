"use client";

import { useState } from "react";
import { DISCOUNTS } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

const FAQS = [
  {
    q: "What discounts do you offer?",
    a: `We take ${DISCOUNTS.single.pct}% off every product, and ${DISCOUNTS.bulk.pct}% off once your order reaches ${DISCOUNTS.bulk.minQty} pieces in total — across the whole cart, not per design. Both are applied automatically at checkout; there is no coupon code. The bulk rate is our factory-direct pricing passed straight on.`,
  },
  {
    q: "What is your minimum order quantity (MOQ)?",
    a: `You can order from a single piece and still get ${DISCOUNTS.single.pct}% off. Reach ${DISCOUNTS.bulk.minQty} pieces in one order — mixing designs and sizes is fine — and the discount rises to ${DISCOUNTS.bulk.pct}%. A handful of made-to-order designs carry their own higher minimum, which is shown on the product page.`,
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
              <h3>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                >
                  <span className="font-sans font-semibold tracking-normal text-ink-900 dark:text-white">
                    {f.q}
                  </span>
                  <span
                    className={`shrink-0 text-flame-500 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <Icon name="plus" size={20} strokeWidth={2.2} />
                  </span>
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                className={`grid transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
