"use client";

import { useEffect, useState } from "react";
import { DISCOUNTS } from "@/lib/site";
import { Icon, type IconName } from "@/components/ui/Icon";

type Message = { icon: IconName; text: string };

// Derived from the discount config rather than retyped, so a rate change in
// site.ts can never leave the bar advertising an offer the cart won't honour.
const MESSAGES: Message[] = [
  {
    icon: "percent",
    text: `${DISCOUNTS.bulk.pct}% off orders of ${DISCOUNTS.bulk.minQty}+ pieces — applied automatically at checkout`,
  },
  {
    icon: "tag",
    text: `${DISCOUNTS.single.pct}% off every product, from a single piece — no minimum order`,
  },
  { icon: "palette", text: "Free digital mockup with every order — no commitment" },
  { icon: "truck", text: "Factory-direct pricing, delivered across India from Meerut" },
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const msg = MESSAGES[i];

  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-ink-950 text-white">
      <div className="container-x flex h-9 items-center justify-center">
        {/* aria-live so the rotation is announced once rather than read as four
            separate blocks of page text by a screen reader. */}
        <p
          key={i}
          aria-live="polite"
          className="animate-fade-up flex items-center gap-2 text-center text-xs font-medium text-ink-200"
        >
          <span className="text-flame-500">
            <Icon name={msg.icon} size={13} />
          </span>
          {msg.text}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-flame-500/60 to-transparent" />
    </div>
  );
}
