"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/site";

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Slide in after 2s delay
    const t1 = setTimeout(() => setVisible(true), 2000);
    // Show tooltip after 4s
    const t2 = setTimeout(() => setShowTooltip(true), 4000);
    // Auto-dismiss tooltip after 8s
    const t3 = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 animate-slide-in-up">
      {/* Tooltip */}
      {showTooltip && (
        <div className="animate-tooltip hidden sm:block">
          <div className="relative rounded-xl border border-ink-100 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 shadow-xl dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200">
            Questions about an order? Chat with us.
            {/* Arrow */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 border-r border-t border-ink-100 bg-white dark:border-ink-700 dark:bg-ink-900" />
          </div>
        </div>
      )}

      {/* Button */}
      <a
        href={whatsappLink("Hi ACCTIVE Sports, I'd like to enquire about custom sportswear.")}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        onClick={() => setShowTooltip(false)}
        className="group relative flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl wa-pulse"
      >
        {/* Outer ring */}
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366]/40 animate-ping" style={{ animationDuration: "3s" }} />

        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.04-.5.4-3.15-.66-2.66-1.05-4.32-3.77-4.45-3.95-.13-.17-1.06-1.41-1.06-2.69 0-1.28.67-1.91.9-2.17.24-.26.53-.33.7-.33.18 0 .35 0 .5.01.16.01.38-.06.59.45.24.58.81 2 .88 2.14.07.13.12.29.02.46-.09.17-.14.29-.28.44-.14.16-.29.35-.42.47-.14.13-.28.28-.12.55.16.26.72 1.18 1.54 1.91 1.06.95 1.96 1.24 2.23 1.38.27.13.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.22.59-.13.24.09 1.52.72 1.78.85.26.13.43.19.5.3.07.11.07.64-.17 1.32z" />
        </svg>
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}
