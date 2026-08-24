"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MESSAGES = [
  "🎨 Free digital mockup with every order — no commitment needed",
  "🚚 Factory-direct prices · Delivered across India from Meerut",
  "🏆 Trusted by 500+ academies, clubs & schools nationwide",
  "⚡ Sublimation that stays vivid — wash after wash, season after season",
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden bg-ink-950 text-white">
      {/* Gradient accent lines */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-flame-500/70 to-transparent" />

      <div className="container-x flex h-9 items-center justify-between gap-4 overflow-hidden">
        {/* Logo thumbnail */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <Image
            src="https://res.cloudinary.com/rdhqircc/image/upload/v1787571541/WhatsApp_Image_2026-08-24_at_4.48.59_PM-removebg-preview_gabj92.png"
            alt="ACCTIVE Sports"
            width={60}
            height={20}
            className="h-5 w-auto object-contain opacity-80"
          />
        </div>

        {/* Rotating message */}
        <div className="flex flex-1 items-center justify-center text-center text-xs font-medium">
          <span key={i} className="animate-fade-up">
            {MESSAGES[i]}
          </span>
        </div>

        {/* Right accent */}
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-flame-500 animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">
            Live
          </span>
        </div>
      </div>
    </div>
  );
}
